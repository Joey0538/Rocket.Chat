import EventEmitter from 'events';

import { decryptStatsToken } from './token';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const NO_ACTION_PERIOD_IN_DAYS = 3;
const WARNING_PERIOD_IN_DAYS = 7;

class AirGappedRestrictionClass extends EventEmitter {
	private restricted = false;

	public get isRestricted(): boolean {
		return this.restricted;
	}

	public async checkRemainingDaysSinceLastStatsReport(encryptedToken: string): Promise<void> {
		try {
			const { timestamp: lastStatsReportTimestamp } = JSON.parse(await decryptStatsToken(encryptedToken));
			const now = new Date();
			const lastStatsReport = new Date(lastStatsReportTimestamp);
			const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
			const lastStatsReportUTC = Date.UTC(lastStatsReport.getFullYear(), lastStatsReport.getMonth(), lastStatsReport.getDate());

			const daysSinceLastStatsReport = Math.floor((nowUTC - lastStatsReportUTC) / DAY_IN_MS);

			this.notifyRemainingDaysUntilRestriction(daysSinceLastStatsReport);
		} catch {
			this.applyRestrictions();
		}
	}

	public applyRestrictions(): void {
		this.restricted = true;
		this.emit('remainingDays', { days: 0 });
	}

	public removeRestrictions(): void {
		this.restricted = false;
		this.emit('remainingDays', { days: -1 });
	}

	private notifyRemainingDaysUntilRestriction(daysSinceLastStatsReport: number): void {
		const remainingDaysUntilRestriction = NO_ACTION_PERIOD_IN_DAYS + WARNING_PERIOD_IN_DAYS - daysSinceLastStatsReport;
		const olderThanTenDays = remainingDaysUntilRestriction < 0;
		if (olderThanTenDays) {
			return this.applyRestrictions();
		}

		this.emit('remainingDays', { days: remainingDaysUntilRestriction });
	}
}

const airGappedRestriction = Object.assign(new AirGappedRestrictionClass(), {
	WARNING_PERIOD_IN_DAYS,
});

export { airGappedRestriction as AirGappedRestriction };

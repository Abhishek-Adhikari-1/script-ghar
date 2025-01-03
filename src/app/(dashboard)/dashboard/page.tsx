import DataCard from "@/components/dashboard/layout/data-card";
import EventCalendar from "@/components/dashboard/layout/event-calander";
import StockChart from "@/components/dashboard/layout/stock-chart";
import TradeSummary from "@/components/dashboard/layout/trade-summary";
import React from "react";

const DashboardPage = async () => {
  return (
    <div className="flex gap-3 flex-col md:flex-row">
      {/* LEFT SIDE CONTENT */}
      <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-3">
      <div className="flex gap-3 justify-between flex-wrap">
					<DataCard type="Total turnovers" value="4,603,282,379"/>
					<DataCard type="Volume" value="10,086,705"/>
					<DataCard type="Total traded scripts" value="10,086,705" />
					<DataCard type="Transactions" value="50,447" />
				</div>
        <StockChart />
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className="w-full md:w-2/5 lg:w-1/3 flex gap-3 flex-col">
        <EventCalendar />
        <TradeSummary />
      </div>
    </div>
  );
};

export default DashboardPage;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryItemProps {
  label: string;
  value: string | number;
}

const SummaryItem = ({ label, value }: SummaryItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-500 dark:text-zinc-400 text-sm">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

const TradeSummary = async () => {
  return (
    <>
      <Card className="bg-card shadow-none border-none rounded-md">
        <CardHeader className="pb-1">
          <CardTitle className="text-center text-gray-700 dark:text-gray-300">
            MY TRADE SUMMARY
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold">NPR. 0.00</div>
            <div className="text-gray-600 dark:text-gray-400">
              Total Turnover
            </div>
          </div>
          <SummaryItem label="Traded Shares" value="0" />
          <SummaryItem label="Transactions" value="0" />
          <SummaryItem label="Scrips Traded" value="0" />
          <SummaryItem label="Buy Count" value="0" />
          <SummaryItem label="Buy Summary" value="0" />
          <SummaryItem label="Sell Count" value="0" />
          <SummaryItem label="Sell Summary" value="0" />
        </CardContent>
      </Card>
      <Card className="bg-card shadow-none border-none rounded-md">
        <CardHeader className="pb-1">
          <CardTitle className="text-center text-gray-700 dark:text-gray-300">
            MY COLLATERAL SUMMARY
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold">NPR. 0.00</div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TradeSummary;

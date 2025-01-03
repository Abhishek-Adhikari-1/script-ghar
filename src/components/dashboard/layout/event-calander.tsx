"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";

const EventCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="rounded-md bg-card w-full">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={{ dayOfWeek: [6] }}
        modifiers={{
          holidays: [
            new Date(2025, 0, 1),
            new Date(2025, 0, 9),
            new Date(2025, 0, 14),
            {
              from: new Date(2025, 0, 23),
              to: new Date(2025, 0, 26),
            },
          ],
        }}
      />
    </div>
  );
};

export default EventCalendar;

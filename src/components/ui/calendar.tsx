"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

type CalendarMode = "days" | "months" | "years"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()
  const [mode, setMode] = React.useState<CalendarMode>("days")
  const [displayMonth, setDisplayMonth] = React.useState<Date>(props.month || props.defaultMonth || new Date())

  React.useEffect(() => {
    if (props.month) {
      setDisplayMonth(props.month)
    }
  }, [props.month])

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(displayMonth.getFullYear(), monthIndex, 1)
    setDisplayMonth(newDate)
    setMode("days")
  }

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, displayMonth.getMonth(), 1)
    setDisplayMonth(newDate)
    setMode("months")
  }

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]

  const fromYear = props.fromYear || 1900
  const toYear = props.toYear || 2100
  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  )

  // Render month picker
  if (mode === "months") {
    return (
      <div 
        data-slot="calendar"
        className={cn(
          "bg-background group/calendar p-3 w-fit [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", 
          className
        )}
      >
        <div className="flex items-center justify-between mb-4 h-(--cell-size)">
          <Button
            variant={buttonVariant}
            className="size-(--cell-size) p-0 select-none"
            onClick={() => {
              const newDate = new Date(displayMonth.getFullYear() - 1, displayMonth.getMonth(), 1)
              setDisplayMonth(newDate)
            }}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <button
            onClick={() => setMode("years")}
            className="text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-1.5 transition-colors select-none"
          >
            {displayMonth.getFullYear()}
          </button>
          <Button
            variant={buttonVariant}
            className="size-(--cell-size) p-0 select-none"
            onClick={() => {
              const newDate = new Date(displayMonth.getFullYear() + 1, displayMonth.getMonth(), 1)
              setDisplayMonth(newDate)
            }}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {months.map((monthName, index) => (
            <button
              key={monthName}
              onClick={() => handleMonthSelect(index)}
              className={cn(
                "py-3 px-4 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors select-none font-normal",
                displayMonth.getMonth() === index && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-medium"
              )}
            >
              {monthName}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Render year picker
  if (mode === "years") {
    const currentDecadeStart = Math.floor(displayMonth.getFullYear() / 12) * 12
    const displayYears = years.slice(
      Math.max(0, currentDecadeStart - fromYear),
      Math.min(years.length, currentDecadeStart - fromYear + 12)
    )

    return (
      <div 
        data-slot="calendar"
        className={cn(
          "bg-background group/calendar p-3 w-fit [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", 
          className
        )}
      >
        <div className="flex items-center justify-between mb-4 h-(--cell-size)">
          <Button
            variant={buttonVariant}
            className="size-(--cell-size) p-0 select-none"
            onClick={() => {
              const newDate = new Date(displayMonth.getFullYear() - 12, displayMonth.getMonth(), 1)
              setDisplayMonth(newDate)
            }}
            disabled={displayYears[0] <= fromYear}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <div className="text-sm font-medium select-none">
            {displayYears[0]} - {displayYears[displayYears.length - 1]}
          </div>
          <Button
            variant={buttonVariant}
            className="size-(--cell-size) p-0 select-none"
            onClick={() => {
              const newDate = new Date(displayMonth.getFullYear() + 12, displayMonth.getMonth(), 1)
              setDisplayMonth(newDate)
            }}
            disabled={displayYears[displayYears.length - 1] >= toYear}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {displayYears.map((year) => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className={cn(
                "py-3 px-4 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors select-none font-normal",
                displayMonth.getFullYear() === year && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-medium"
              )}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Render normal day picker
  return (
    <DayPicker
      {...props}
      showOutsideDays={showOutsideDays}
      month={displayMonth}
      onMonthChange={(newMonth) => {
        setDisplayMonth(newMonth)
        if (props.onMonthChange) {
          props.onMonthChange(newMonth)
        }
      }}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between pointer-events-none",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none pointer-events-auto",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none pointer-events-auto",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size) relative z-10",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-popover inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors",
          captionLayout === "label"
            ? "text-sm"
            : "pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md bg-accent",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        CaptionLabel: ({ children, ...props }) => {
          // Remove role and aria-live to make button properly interactive
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { role: _role, "aria-live": _ariaLive, ...buttonProps } = props as Record<string, unknown>;
          
          return (
            <button
              {...(buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setMode("months")
              }}
              className="select-none font-medium text-sm hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors cursor-pointer"
            >
              {children}
            </button>
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
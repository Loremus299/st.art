import { cn } from "@/lib/utils";
import {
  ComponentProps,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  createSwapy,
  type Swapy,
  type SwapEndEvent,
  type SwapEvent,
  type SwapStartEvent,
} from "swapy";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete03Icon,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
} from "@hugeicons/core-free-icons";

export interface SwapyNode {
  id: string;
  col: number;
  row: number;
  node: ReactNode;
}

type Props = ComponentProps<"div"> & {
  initialSwapyData?: Array<SwapyNode>;
  initialsCols?: number;
  initialEdit?: boolean;
  onSwap?: (arg: SwapEvent) => void;
  onSwapStart?: (arg: SwapStartEvent) => void;
  onSwapEnd?: (arg: SwapEndEvent) => void;
  onEditStart?: (arg: Array<SwapyNode>) => void;
  onEditEnd?: (arg: Array<SwapyNode>) => void;
  onColsChange?: (arg: number) => void;
  onResize?: (arg: SwapyNode) => void;
  onDelete?: (arg: SwapyNode) => void;
};

const SwapyContext = createContext<{
  swapyData: Array<SwapyNode>;
  setSwapyData: Dispatch<SetStateAction<SwapyNode[]>>;
  cols: number;
  setCols: Dispatch<SetStateAction<number>>;
  edit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
  onEditStart: (arg: Array<SwapyNode>) => void;
  onEditEnd: (arg: Array<SwapyNode>) => void;
  onColsChange: (arg: number) => void;
  onResize: (arg: SwapyNode) => void;
  onDelete: (arg: SwapyNode) => void;
} | null>(null);

export default function SwapyGrid({
  initialSwapyData = [],
  initialsCols = 2,
  initialEdit = true,
  onSwap = () => {},
  onSwapStart = () => {},
  onSwapEnd = () => {},
  onEditStart = () => {},
  onEditEnd = () => {},
  onColsChange = () => {},
  onResize = () => {},
  onDelete = () => {},
  className,
  children,
  ...props
}: Props) {
  const swapy = useRef<Swapy>(null);
  const container = useRef<HTMLDivElement>(null);
  const [swapyData, setSwapyData] = useState(initialSwapyData);
  const [cols, setCols] = useState(initialsCols);
  const [edit, setEdit] = useState(initialEdit);

  useEffect(() => {
    if (!container.current) return;
    swapy.current = createSwapy(container.current, { swapMode: "drop" });

    swapy.current.onSwap((event) => {
      onSwap(event);
    });

    swapy.current.onSwapStart((event) => {
      onSwapStart(event);
    });

    swapy.current.onSwapEnd((event) => {
      if (event.hasChanged) {
        const slotItemMap = event.slotItemMap.asObject;

        setSwapyData((prev) => {
          const itemMap = new Map(
            prev.map((item) => [`item-${item.id}`, item]),
          );
          const nextData: SwapyNode[] = [];

          for (let i = 0; i < prev.length; i++) {
            const slotId = `slot-${i}`;
            const itemId = slotItemMap[slotId];

            if (itemId && itemMap.has(itemId)) {
              nextData.push(itemMap.get(itemId)!);
            }
          }

          return nextData.length === prev.length ? nextData : prev;
        });
      }
      onSwapEnd(event);
    });

    swapy.current.enable(edit);

    return () => {
      swapy.current?.destroy();
      swapy.current = null;
    };
  }, [edit, onSwap, onSwapEnd, onSwapStart]);

  return (
    <SwapyContext.Provider
      value={{
        swapyData,
        setSwapyData,
        cols,
        setCols,
        edit,
        setEdit,
        onEditStart,
        onEditEnd,
        onResize,
        onDelete,
        onColsChange,
      }}
    >
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <SwapyEdit
            variant={"secondary"}
            size={"icon-xs"}
            className={"text-xs fixed bottom-4 right-4"}
          />
          {edit && (
            <div className="flex gap-1 items-center bg-background rounded-md">
              <SwapySub variant={"ghost"} size={"icon-xs"} />
              <SwapyDisplay className="text-xs" />
              <SwapyAdd variant={"ghost"} size={"icon-xs"} />
            </div>
          )}
        </div>
        <div
          {...props}
          className={cn("grid gap-4", className)}
          style={{
            gridTemplateColumns: `repeat(${cols}, ${100 / cols}%)`,
          }}
          ref={container}
        >
          {swapyData.map((item, index) => (
            <SwapyItem
              index={index}
              key={item.id}
              id={item.id}
              col={item.col}
              row={item.row}
              node={item.node}
            />
          ))}
          {edit ? children : ""}
        </div>
      </div>
    </SwapyContext.Provider>
  );
}

type ButtonProps = ComponentProps<typeof Button>;
type DivProps = ComponentProps<"div">;

export function SwapyAddItem({
  id,
  row,
  col,
  item,
  onAdd = () => {},
  children,
  ...props
}: ButtonProps & {
  id: string;
  row: number;
  col: number;
  item: ReactNode;
  onAdd?: (arg: Array<SwapyNode>, node: SwapyNode) => void;
}) {
  const ctx = useContext(SwapyContext);

  return (
    <Button
      {...props}
      onClick={() => {
        ctx?.setSwapyData([...ctx.swapyData, { id, col, row, node: item }]);

        onAdd(ctx!.swapyData, {
          id,
          col,
          row,
          node: item,
        });
      }}
    >
      {children}
    </Button>
  );
}
function SwapyDisplay(props: DivProps) {
  const ctx = useContext(SwapyContext);

  return <div {...props}>{ctx?.cols}</div>;
}

function SwapyEdit(props: ButtonProps) {
  const ctx = useContext(SwapyContext);

  return (
    <Button
      {...props}
      onClick={() => {
        if (ctx?.edit) {
          ctx.onEditEnd(ctx.swapyData);
        } else {
          ctx?.onEditStart(ctx.swapyData);
        }

        ctx?.setEdit(!ctx.edit);
      }}
    >
      {ctx?.edit ? (
        <HugeiconsIcon icon={LockKeyholeOpenIcon} />
      ) : (
        <HugeiconsIcon icon={LockKeyholeIcon} />
      )}
    </Button>
  );
}

function SwapyAdd(props: ButtonProps) {
  const ctx = useContext(SwapyContext);
  return (
    <Button
      {...props}
      onClick={() => {
        ctx?.setCols(ctx.cols + 1);
        ctx?.onColsChange(ctx.cols);
      }}
    >
      +
    </Button>
  );
}

function SwapySub(props: ButtonProps) {
  const ctx = useContext(SwapyContext);
  if (ctx?.cols == 1) {
    return "";
  }
  return (
    <Button
      {...props}
      onClick={() => {
        ctx?.setCols(ctx.cols - 1);

        ctx?.setSwapyData(
          ctx.swapyData.map((item) =>
            item.col > ctx.cols - 1 ? { ...item, col: item.col - 1 } : item,
          ),
        );

        ctx?.onColsChange(ctx.cols);
      }}
    >
      -
    </Button>
  );
}

function SwapyItem(item: SwapyNode & { index: number }) {
  const ctx = useContext(SwapyContext);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowEdit(true)}
      onMouseLeave={() => setShowEdit(false)}
      style={{
        gridRow: `span ${item.row} / span ${item.row}`,
        gridColumn: `span ${item.col} / span ${item.col}`,
      }}
    >
      {ctx?.edit && showEdit && (
        <div className="absolute z-10">
          <div className="bg-muted -mt-2 -ml-2 flex items-center rounded-r-full rounded-tl-md">
            <SwapyItemDel
              id={item.id}
              variant={"secondary"}
              size={"icon-xs"}
              className={"text-xs"}
            />
            <SwapyItemSubCol
              id={item.id}
              variant={"ghost"}
              size={"icon-xs"}
              className={"text-xs rounded-none"}
            />
            <SwapyColDisplay id={item.id} className="text-xs" />
            <SwapyItemAddCol
              id={item.id}
              variant={"ghost"}
              size={"icon-xs"}
              className={"text-xs bg-none"}
            />
          </div>
          <div className="bg-muted -mt-1 -ml-2 w-5.5 grid place-items-center rounded-b-full">
            <SwapyItemSubRow
              id={item.id}
              variant={"ghost"}
              size={"icon-xs"}
              className={"text-xs rounded-none"}
            />
            <SwapyRowDisplay id={item.id} className="text-xs" />
            <SwapyItemAddRow
              id={item.id}
              variant={"ghost"}
              size={"icon-xs"}
              className={"text-xs bg-none"}
            />
          </div>
        </div>
      )}
      <div
        key={item.index}
        data-swapy-slot={`slot-${item.index}`}
        className="h-full w-full"
      >
        <div className="h-full w-full" data-swapy-item={`item-${item.id}`}>
          {item.node}
        </div>
      </div>
    </div>
  );
}

function SwapyItemAddCol(props: ButtonProps & { id: string }) {
  const ctx = useContext(SwapyContext);
  const cur = ctx?.swapyData.find((x) => x.id === props.id);
  if (!cur) return;

  if (cur.col === ctx?.cols) return;

  return (
    <Button
      {...props}
      onClick={() => {
        ctx?.setSwapyData(
          ctx.swapyData.map((item) =>
            item.id === cur.id ? { ...item, col: item.col + 1 } : item,
          ),
        );

        ctx?.onResize(ctx.swapyData.find((item) => item.id === cur.id)!);
      }}
    >
      +
    </Button>
  );
}

function SwapyItemSubCol(props: ButtonProps & { id: string }) {
  const ctx = useContext(SwapyContext);
  const cur = ctx?.swapyData.find((x) => x.id === props.id);
  if (!cur) return;

  if (cur.col === 1) return;

  return (
    <Button
      {...props}
      onClick={() => {
        ctx?.setSwapyData(
          ctx.swapyData.map((item) =>
            item.id === cur.id ? { ...item, col: item.col - 1 } : item,
          ),
        );

        ctx?.onResize(ctx.swapyData.find((item) => item.id === cur.id)!);
      }}
    >
      -
    </Button>
  );
}

function SwapyItemAddRow(props: ButtonProps & { id: string }) {
  const ctx = useContext(SwapyContext);
  const cur = ctx?.swapyData.find((x) => x.id === props.id);
  if (!cur) return;

  return (
    <Button
      {...props}
      onClick={() => {
        ctx?.setSwapyData(
          ctx.swapyData.map((item) =>
            item.id === cur.id ? { ...item, row: item.row + 1 } : item,
          ),
        );

        ctx?.onResize(ctx.swapyData.find((item) => item.id === cur.id)!);
      }}
    >
      +
    </Button>
  );
}

function SwapyItemSubRow(props: ButtonProps & { id: string }) {
  const ctx = useContext(SwapyContext);
  const cur = ctx?.swapyData.find((x) => x.id === props.id);
  if (!cur) return;

  if (cur.row === 1) return;

  return (
    <Button
      {...props}
      onClick={() => {
        ctx?.setSwapyData(
          ctx.swapyData.map((item) =>
            item.id === cur.id ? { ...item, row: item.row - 1 } : item,
          ),
        );

        ctx?.onResize(ctx.swapyData.find((item) => item.id === cur.id)!);
      }}
    >
      -
    </Button>
  );
}

function SwapyItemDel(props: ButtonProps & { id: string }) {
  const ctx = useContext(SwapyContext);
  const cur = ctx?.swapyData.find((x) => x.id === props.id);
  if (!cur) return;

  return (
    <Button
      {...props}
      onClick={() => {
        ctx?.setSwapyData(ctx.swapyData.filter((item) => item.id !== props.id));

        ctx?.onDelete(ctx.swapyData.find((item) => item.id === cur.id)!);
      }}
    >
      <HugeiconsIcon icon={Delete03Icon} />
    </Button>
  );
}

function SwapyColDisplay(props: DivProps & { id: string }) {
  const ctx = useContext(SwapyContext);
  const cur = ctx?.swapyData.find((x) => x.id === props.id);
  if (!cur) return;

  return <div {...props}>{cur.col}</div>;
}

function SwapyRowDisplay(props: DivProps & { id: string }) {
  const ctx = useContext(SwapyContext);
  const cur = ctx?.swapyData.find((x) => x.id === props.id);
  if (!cur) return;

  return <div {...props}>{cur.row}</div>;
}

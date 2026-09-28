import {
  BookmarkAdd01Icon,
  PencilEdit01Icon,
  TrashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dexie from "@/dexie";
import FormController from "./badcn/formController";

export default function BookmarkDisplay({ id }: { id: string }) {
  const [mouseOver, setMouseOver] = useState(false);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(() => {
    let title = "Category";
    const askStorage = localStorage.getItem(id);
    if (askStorage) {
      title = askStorage;
    }
    return title;
  });
  const [data, setData] = useState<
    { link: string; text: string; id?: number }[]
  >([]);

  useEffect(() => {
    const f = async () => {
      const data = await dexie.bookmarksByRef(id);
      setData(data);
    };
    f();
  }, [id]);

  return (
    <div className="rounded-md w-full h-full border p-2 backdrop-blur-md bg-transparent min-h-20 text-primary border-primary drop-shadow-xs drop-shadow-black">
      <div
        className="flex justify-between items-center gap-2"
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => {
          setMouseOver(false);
          setEdit(false);
        }}
      >
        {edit && (
          <Input
            placeholder={title}
            onChange={(e) => {
              localStorage.setItem(id, e.currentTarget.value);
              setTitle(e.currentTarget.value);
            }}
          />
        )}
        {!edit && <p className="tracking-tight font-semibold">{title}</p>}
        {mouseOver && (
          <div className="flex gap-2">
            <Button
              variant={"ghost"}
              size={"icon-xs"}
              onClick={() => setEdit(true)}
            >
              <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon-xs"}
              onClick={() => setOpen(true)}
            >
              <HugeiconsIcon icon={BookmarkAdd01Icon} className="size-4" />
            </Button>
          </div>
        )}
      </div>
      {data.map((item, index) => (
        <Bookmark key={index} item={item} />
      ))}
      <Addbookmark open={open} setOpen={setOpen} reference={id} />
    </div>
  );
}

function Addbookmark({
  reference,
  open,
  setOpen,
}: {
  reference: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const schema = z.object({
    link: z.url(),
    name: z.string().min(1),
  });
  type Values = z.infer<typeof schema>;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { link: "", name: "" },
  });

  const onSubmit = (values: Values) => {
    dexie.addBookmark({ reference, link: values.link, text: values.name });
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add bookmark.</DialogTitle>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormController
              form={form}
              label="URL"
              name="link"
              render={({ field, fieldState }) => (
                <Input
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="https://start.loremus.gay"
                  {...field}
                />
              )}
            />
            <FormController
              form={form}
              label="Display Name"
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Startpage"
                  {...field}
                />
              )}
            />
            <Button type="submit">Add bookmark.</Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function Bookmark({
  item,
}: {
  item: { link: string; text: string; id?: number };
}) {
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <div
      className="flex justify-between"
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <a
        href={item.link}
        className="hover:underline underline-offset-2"
        target="_blank"
      >
        {"> "}
        {item.text}
      </a>
      {mouseOver && (
        <Button
          variant={"ghost"}
          size={"icon-xs"}
          onClick={async () => {
            dexie.removeBookmark(item.id);
            window.location.reload();
          }}
        >
          <HugeiconsIcon icon={TrashIcon} />
        </Button>
      )}
    </div>
  );
}

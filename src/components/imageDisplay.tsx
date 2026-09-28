import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import dexie from "@/dexie";
import ImageInput from "./badcn/imageInput";
import { Button, buttonVariants } from "./ui/button";
import z from "zod";
import FormController from "./badcn/formController";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function ImageDisplay({
  edit,
  id,
  width,
  height,
}: {
  edit: boolean;
  id: string;
  width: number;
  height: number;
}) {
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [size] = useState(() => {
    return {
      width: width * 70,
      height: height * 70,
    };
  });

  useEffect(() => {
    let newrl = "";
    const f = async () => {
      const image = await dexie.imageByRef(id);
      if (image) {
        newrl = URL.createObjectURL(image);
        setUrl(newrl);
      }
    };
    f();

    return () => {
      URL.revokeObjectURL(newrl);
    };
  }, [id]);

  return (
    <div className="rounded-md border w-full h-full backdrop-blur-md bg-transparent min-h-20 text-primary border-primary drop-shadow-xs drop-shadow-black grid place-items-center">
      {edit ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={buttonVariants({ variant: "ghost" })}>
            Add image
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add image.</DialogTitle>
              <ImageUploadForm reference={id} dialogState={setOpen} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="rounded-md w-full h-full backdrop-blur-md bg-transparent min-h-20 text-primary border-primary drop-shadow-xs drop-shadow-black grid place-items-center">
          <img
            src={url}
            className={"rounded-md"}
            style={{ width: size.width + "px", height: size.height + "px" }}
          />
        </div>
      )}
    </div>
  );
}

function ImageUploadForm({
  reference,
  dialogState,
}: {
  reference: string;
  dialogState: Dispatch<SetStateAction<boolean>>;
}) {
  const schema = z.object({
    img: z.file(),
  });
  type Values = z.infer<typeof schema>;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      img: undefined,
    },
  });

  const onSubmit = async (values: Values) => {
    console.log("on submit triggered");
    await dexie.addImage({ image: values.img, reference });
    dialogState(false);
  };

  return (
    <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
      <FormController
        form={form}
        label="Image"
        name="img"
        render={({ field, fieldState }) => {
          return (
            <ImageInput
              aria-invalid={fieldState.invalid}
              id={field.name}
              onChange={(e) => {
                const file = e.target.files?.[0];
                field.onChange(file);
              }}
            />
          );
        }}
      />
      <Button type="submit">Add image.</Button>
    </form>
  );
}

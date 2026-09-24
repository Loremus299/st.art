import { Textarea } from "./ui/textarea";

export default function TextDisplay({
  edit,
  id,
}: {
  edit: boolean;
  id: string;
}) {
  const p = localStorage.getItem(id);
  return (
    <div>
      {edit ? (
        <Textarea
          onChange={(e) => {
            localStorage.setItem(id, e.currentTarget.value);
          }}
          placeholder={p!}
          className="rounded-md w-full h-full backdrop-blur-md bg-transparent min-h-20 text-primary border-primary"
        />
      ) : (
        <div className="p-2 pt-0 pb-0 w-full h-full text-lg text-pretty backdrop-blur-md border min-h-20  text-primary border-primary rounded-md grid place-items-center">
          {p}
        </div>
      )}
    </div>
  );
}

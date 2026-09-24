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
    <div className="w-full h-full text-lg text-pretty backdrop-blur-md text-background border dark:text-primary min-h-20  dark:border-primary rounded-md grid place-items-center">
      {edit ? (
        <Textarea
          onChange={(e) => {
            localStorage.setItem(id, e.currentTarget.value);
          }}
          placeholder={p!}
          className="rounded-md"
        />
      ) : (
        <p>{p}</p>
      )}
    </div>
  );
}

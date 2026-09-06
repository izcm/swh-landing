import { LayoutDashboard } from "lucide-react";
import Card from "../Card";

export default function HubShowcase() {
  return (
    <section className="py-16 text-center">
      <span className="eyebrow">THE HUB</span>
      <h2 className="mt-2 text-2xl text-fg md:text-3xl">
        Administer automations in one place.
        <br />
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-subtle">
        While automated processes can run without intervention, a custom hotspot
        or Hub gives you one place to review activity, trigger actions manually
        and change how an automation behaves – through an intuitive interface.
      </p>

      {/* placeholder: swap for an actual product screenshot */}
      <Card className="mx-auto mt-10 flex aspect-video max-w-3xl flex-col items-center justify-center gap-2 text-faint">
        <LayoutDashboard className="h-8 w-8" strokeWidth={1.4} />
        <span className="text-xs">Product preview</span>
      </Card>
    </section>
  );
}

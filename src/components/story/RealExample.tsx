import { Fingerprint, Car, Users, Mail, User, BarChart3 } from "lucide-react";
import Card from "../Card";

const sources = [
  { icon: Fingerprint, label: "Microsoft Entra", sub: "Authentication" },
  { icon: Car, label: "Vehicle API", sub: "Vehicle data" },
  { icon: Users, label: "PowerOffice", sub: "Employee data" },
];

const outputs = [
  { icon: Mail, label: "Notifications" },
  { icon: User, label: "The Hub" },
  { icon: BarChart3, label: "Insights" },
];

export default function RealExample() {
  return (
    <section id="real-example" className="border-t border-line py-16 text-center">
      <span className="eyebrow">SEE THE MINDSET IN PRACTICE</span>
      <h2 className="mt-2 text-2xl text-fg md:text-3xl">A real example.</h2>
      <p className="mx-auto mt-4 max-w-xl text-subtle">
        Our demo uses vehicle maintenance to show how we work: authenticate with
        Microsoft Entra, poll vehicle data from external APIs, fetch employees
        from PowerOffice and add the missing pieces — like assigning a
        maintenance responsible and sending notifications.
      </p>

      <div className="mx-auto mt-12 flex max-w-3xl items-center justify-between gap-4">
        <div className="flex flex-col gap-3">
          {sources.map(({ icon: Icon, label, sub }) => (
            <Card
              key={label}
              className="flex items-center gap-3 px-4 py-2 text-left"
            >
              {/* placeholder: swap for the real brand mark */}
              <Icon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.6} />
              <div>
                <p className="text-sm text-fg">{label}</p>
                <p className="text-xs text-faint">{sub}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="flex-center h-16 w-16 shrink-0 border-accent/40 text-fg">
          SWH
        </Card>

        <div className="flex flex-col gap-3">
          {outputs.map(({ icon: Icon, label }) => (
            <Card
              key={label}
              className="flex items-center gap-3 px-4 py-2 text-left"
            >
              <Icon
                className="h-4 w-4 shrink-0 text-accent"
                strokeWidth={1.6}
              />
              <p className="text-sm text-fg">{label}</p>
            </Card>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-xl text-subtle">
        In a next step, the demo can read upcoming offboardings from your
        existing employee system and flag when a responsible person is leaving
        during an upcoming EU inspection period — so you can reassign and avoid
        mishaps.
      </p>
    </section>
  );
}

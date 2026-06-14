import { createTester } from "./tester";
import { noHandRolledFormControl } from "./no-hand-rolled-form-control";

const tester = createTester();

tester.run("no-hand-rolled-form-control", noHandRolledFormControl, {
  valid: [
    {
      code: `const x = <Input value="a" />;`,
      filename: "src/pages/Login.tsx",
    },
    {
      // components/ui is exempt — the primitive itself wraps a raw input.
      code: `const x = <input className="x" />;`,
      filename: "src/components/ui/input.tsx",
    },
  ],
  invalid: [
    {
      code: `const x = <input value="a" />;`,
      filename: "src/pages/Login.tsx",
      errors: [{ messageId: "handRolled" }],
    },
    {
      code: `const x = <textarea />;`,
      filename: "src/pages/Login.tsx",
      errors: [{ messageId: "handRolled" }],
    },
  ],
});

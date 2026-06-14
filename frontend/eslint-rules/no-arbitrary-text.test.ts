import { createTester } from "./tester";
import { noArbitraryText } from "./no-arbitrary-text";

const tester = createTester();

tester.run("no-arbitrary-text", noArbitraryText, {
  valid: [
    { code: `const x = <p className="text-xl">hi</p>;` },
    { code: `const x = <p className="text-sm p-[10px]">hi</p>;` },
  ],
  invalid: [
    {
      code: `const x = <p className="text-[14px]">hi</p>;`,
      errors: [{ messageId: "arbitrary" }],
    },
    {
      code: `const x = <p className="text-[1.25rem]">hi</p>;`,
      errors: [{ messageId: "arbitrary" }],
    },
  ],
});

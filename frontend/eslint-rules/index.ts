import { oneExportedComponentPerFile } from "./one-exported-component-per-file";
import { noArbitraryText } from "./no-arbitrary-text";
import { noColorLiteral } from "./no-color-literal";
import { noHandRolledFormControl } from "./no-hand-rolled-form-control";

/** The local ESLint plugin exposing the design-system rules. */
const plugin = {
  meta: { name: "local", version: "0.1.0" },
  rules: {
    "one-exported-component-per-file": oneExportedComponentPerFile,
    "no-arbitrary-text": noArbitraryText,
    "no-color-literal": noColorLiteral,
    "no-hand-rolled-form-control": noHandRolledFormControl,
  },
};

export default plugin;

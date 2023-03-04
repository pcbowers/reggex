---
"reggex": patch
---

Export all types

Previously, some types were not exported in an effort to decrease the library size. However, since declaration files were being built, any type that was used had to be compiled straight into the type. This meant, best-case scenario, the type was being injected once wherever it was used. Worst-case, it was repeated multiple times bloating the size of the declaration file 😱.

By exporting all the types, more advanced users of the library have access to all the type primitives while simultaneously reducing the total library size. A win-win! **TLDR: the declaration file was reduced from 157kb to 36kb!**

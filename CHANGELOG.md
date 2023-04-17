# reggex

## 0.5.1

### Patch Changes

- fa405cd: Bug Fix for Named Captures - Adds better typing when using named captures

## 0.5.0

### Minor Changes

- 14106ba: Add full list of input characters
- bac4737: Add Full List of Quantifiers

## 0.4.1

### Patch Changes

- 91244f2: Switch to cjs as default

  Rather than specifying `type: "module"`, the `tsup` defaults are now used. This ensures any changes down the line are better supported.

## 0.4.0

### Minor Changes

- c66a7ce: Add return types

  Return types have been added to all functions. This should drastically reduce type checking times.

### Patch Changes

- c66a7ce: Export all types

  Previously, some types were not exported in an effort to decrease the library size. However, since declaration files were being built, any type that was used had to be compiled straight into the type. This meant, best-case scenario, the type was being injected once wherever it was used. Worst-case, it was repeated multiple times bloating the size of the declaration file 😱.

  By exporting all the types, more advanced users of the library have access to all the type primitives while simultaneously reducing the total library size. A win-win! **TLDR: the declaration file was reduced from 157kb to 36kb!**

## 0.3.1

### Patch Changes

- 3a6c2e5: Mark the package as having no side effects so that if the transformer is used and no functions/classes are being used anymore within the reggex library, the dependencies are not bundled on build.

## 0.3.0

### Minor Changes

- 45fe840: Add the ability to compile a Reggex to a TypedRegExp
- 8e70de5: Add transformer plugin to pre-compile a Reggex into a RegExp to completely remove any performance overhead that is added by this library

  Note: This assumes that the `compileReggex()` function is used instead of the `.compile()` method and that the function passed to `compileReggex` does not have any side-effects. If the function passed to `compileReggex` has side-effects, it will be left as-is since `reggex` is completely functional at run-time.

## 0.2.4

### Patch Changes

- 23c31c1: Add badges and logo to README

## 0.2.3

### Patch Changes

- 0416db0: Update LICENSE (increased year and updated name)

## 0.2.2

### Patch Changes

- 1db5ad4: Fix broken msg on Input
- 1db5ad4: Rename Characters to Inputs

## 0.2.1

### Patch Changes

- b5a0822: Fix issue with namespace and appenders where escaped values were not honored

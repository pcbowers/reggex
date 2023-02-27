# reggex

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

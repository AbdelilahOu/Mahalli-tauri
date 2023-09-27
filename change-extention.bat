@ECHO OFF
PUSHD .
FOR /R %%d IN (.) DO (
cd "%%d"
IF EXIST *.tsx (
REN *.tsx *.vue
)
)
POPD
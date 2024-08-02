<template>
  <main class="w-screen h-screen fixed top-0 left-0 grainy-light flex">
    <SideBar />
    <div class="grid grid-rows-[50px_1fr] w-full">
      <Navigation />
      <ScrollArea
        class="w-full scroll-smooth flex flex-col border-t border-slate-100"
      >
        <div class="w-full grainy-light p-2 rounded-md h-full">
          <slot />
        </div>
      </ScrollArea>
    </div>
    <ModalsWrapper />
    <Toaster position="top-center" />
  </main>
</template>

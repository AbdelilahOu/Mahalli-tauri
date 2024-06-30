import { useRouter } from "vue-router";

export function useUpdateRouteQueryParams() {
  const router = useRouter();

  const updateQueryParams = (query: Record<any, any>) => {
    const route = router.currentRoute.value;

    router.push({
      path: route.path,
      query: { ...route.query, ...query },
    });
  };

  return {
    updateQueryParams,
  };
}

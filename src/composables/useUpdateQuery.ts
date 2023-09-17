import { useRoute, useRouter } from "vue-router";

export function useUpdateRouteQueryParams() {
  const router = useRouter();
  const route = useRoute();

  const updateQueryParams = (query: Record<any, any>) => {
    router.push({
      path: route.path,
      params: { ...route.params },
      query: { ...route.query, ...query },
    });
  };

  return {
    updateQueryParams,
  };
}

import { itToolsService } from '@/api/it-tools.service';
import { useUserStore } from '@/stores/user.store';

export function useToolBilling(toolKey: string) {
  const userStore = useUserStore();

  async function consumeAdvancedFeature(featureKey: string, cost = 1) {
    const res = await itToolsService.consumeAdvancedFeature(toolKey, featureKey, cost);
    if (res.data?.user) {
      userStore.user = res.data.user;
    }
    return res.data;
  }

  return {
    consumeAdvancedFeature,
  };
}

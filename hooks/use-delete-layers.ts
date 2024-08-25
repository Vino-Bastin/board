import { useMutation, useSelf } from "@liveblocks/react";

export const useDeleteLayers = () => {
  const selection = useSelf((me) => me.presence.selection);

  return useMutation(
    ({ setMyPresence, storage }) => {
      const liveLayers = storage.get("layers");
      const liverLayerIds = storage.get("layerIds");

      if (!selection) return;
      for (const layerId of selection) {
        liveLayers.delete(layerId);
        const index = liverLayerIds.indexOf(layerId);
        if (index !== -1) {
          liverLayerIds.delete(index);
        }
      }

      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    [selection]
  );
};

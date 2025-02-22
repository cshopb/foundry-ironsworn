import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'
import { AssetDataPropertiesData } from '../item/itemtypes'

interface ActorsAndAssets {
  actors: IronswornActor[]
  assets: IronswornItem[]
}

export function actorsOrAssetsWithConditionEnabled(
  condition: string
): ActorsAndAssets {
  const ret: ActorsAndAssets = { actors: [], assets: [] }

  for (const actor of game.actors?.contents ?? []) {
    const actorData = actor.system as any
    if (actorData.debility?.[condition]) {
      ret.actors.push(actor)
    }

    for (const item of actor.items.filter((x) => x.type === 'asset')) {
      const assetData = item.system as AssetDataPropertiesData
      if (
        assetData.conditions.find(
          (c) => c.name.toLowerCase() === condition.toLowerCase() && c.ticked
        )
      ) {
        ret.assets.push(item)
      }
    }
  }

  return ret
}

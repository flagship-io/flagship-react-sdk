import Flagship, { FlagDTO, FlagMetadata, IFlag, IFlagMetadata } from '@flagship.io/js-sdk'
import { GET_FLAG_CAST_ERROR, GET_METADATA_CAST_ERROR, noVisitorMessage } from './constants'
import { hasSameType, logInfo, logWarn, sprintf } from './utils'

export class Flag<T> implements IFlag<T> {
    private defaultValue:T
    private key: string
    private flag?: FlagDTO
    constructor (defaultValue:T, key: string, flagsData: Map<string, FlagDTO> | undefined) {
      if (!flagsData) {
        logWarn(Flagship.getConfig(), noVisitorMessage, 'GetFlag')
      }
      this.defaultValue = defaultValue
      this.key = key
      this.flag = flagsData?.get(key)
    }

    private NotSameType () {
      return this.defaultValue !== null && this.defaultValue !== undefined && !hasSameType(this.flag?.value, this.defaultValue)
    }

    getValue (): T {
      if (!this.flag) {
        logWarn(Flagship.getConfig(), noVisitorMessage, 'getValue')
        return this.defaultValue
      }

      if (this.NotSameType()) {
        logInfo(
          Flagship.getConfig(),
          sprintf(GET_FLAG_CAST_ERROR, this.key),
          'getValue'
        )
        return this.defaultValue
      }
      return this.flag.value
    }

    exists ():boolean {
      if (!this.flag) {
        logWarn(Flagship.getConfig(), noVisitorMessage, 'exists')
        return false
      }
      return !!(this.flag.campaignId && this.flag.variationId && this.flag.variationGroupId)
    }

    async visitorExposed () : Promise<void> {
      if (!this.flag) {
        logWarn(Flagship.getConfig(), noVisitorMessage, 'visitorExposed')
      }
    }

    get metadata ():IFlagMetadata {
      const functionName = 'metadata'
      if (!this.flag) {
        logWarn(Flagship.getConfig(), noVisitorMessage, functionName)
        return FlagMetadata.Empty()
      }
      if (this.NotSameType()) {
        logInfo(
          Flagship.getConfig(),
          sprintf(GET_METADATA_CAST_ERROR, this.key),
          functionName
        )
        return FlagMetadata.Empty()
      }

      return new FlagMetadata({
        campaignId: this.flag.campaignId,
        campaignName: this.flag.campaignName,
        variationGroupId: this.flag.variationGroupId,
        variationGroupName: this.flag.variationGroupName,
        variationId: this.flag.variationId,
        variationName: this.flag.variationName,
        isReference: !!this.flag.isReference,
        campaignType: this.flag.campaignType as string,
        slug: this.flag.slug
      })
    }
}

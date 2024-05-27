import { Flagship, FlagDTO, FSFlagMetadata, IFSFlag, IFSFlagMetadata, FSFlagStatus } from '@flagship.io/js-sdk'

import { GET_FLAG_CAST_ERROR, noVisitorMessage } from './constants'
import { FsContextState } from './type'
import { hasSameType, logInfo, logWarn, sprintf } from './utils'

export class FSFlag implements IFSFlag {
    private key: string
    private flag?: FlagDTO
    constructor (key: string, state:FsContextState) {
      const flagsData = state.flags
      if (!state.hasVisitorData) {
        logWarn(Flagship.getConfig(), noVisitorMessage, 'GetFlag')
      }
      this.key = key
      this.flag = flagsData?.get(key)
    }

    getValue<T> (defaultValue: T): (T extends null ? unknown : T) {
      if (!this.flag) {
        return defaultValue as (T extends null ? unknown : T)
      }

      if (this.flag.value === null || this.flag.value === undefined) {
        return this.flag.value as (T extends null ? unknown : T)
      }

      if (defaultValue !== null && defaultValue !== undefined && !hasSameType(this.flag.value, defaultValue)) {
        logInfo(
          Flagship.getConfig(),
          sprintf(GET_FLAG_CAST_ERROR, this.key),
          'getValue'
        )
        return defaultValue as (T extends null ? unknown : T)
      }
      return this.flag.value
    }

    exists ():boolean {
      if (!this.flag) {
        return false
      }
      return !!(this.flag.campaignId && this.flag.variationId && this.flag.variationGroupId)
    }

    async visitorExposed () : Promise<void> {
      // do nothing
    }

    get metadata ():IFSFlagMetadata {
      if (!this.flag) {
        return FSFlagMetadata.Empty()
      }
      return new FSFlagMetadata({
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

    get status ():FSFlagStatus {
      if (!this.exists()) {
        return FSFlagStatus.NOT_FOUND
      }
      return FSFlagStatus.FETCHED
    }
}

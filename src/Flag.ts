import Flagship, { FlagMetadata, IFlag, IFlagMetadata, LogLevel } from '@flagship.io/js-sdk'
import { noVisitorMessage } from './constants'
import { logWarn } from './utils'

export class Flag<T> implements IFlag<T> {
    private _defaultValue:T
    constructor (defaultValue:T) {
      logWarn(Flagship.getConfig(), noVisitorMessage, 'GetFlag')
      this._defaultValue = defaultValue
    }

    getValue (): T {
      logWarn(Flagship.getConfig(), noVisitorMessage, 'getValue')
      return this._defaultValue
    }

    exists ():boolean {
      logWarn(Flagship.getConfig(), noVisitorMessage, 'exists')
      return false
    }

    userExposed (): Promise<void> {
      logWarn(Flagship.getConfig(), noVisitorMessage, 'userExposed')
      return Promise.resolve()
    }

    get metadata ():IFlagMetadata {
      logWarn(Flagship.getConfig(), noVisitorMessage, 'metadata')
      return new FlagMetadata({
        campaignId: '',
        campaignType: '',
        isReference: false,
        variationGroupId: '',
        variationId: ''
      })
    }
}

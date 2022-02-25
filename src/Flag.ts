import { FlagMetadata, IFlag, IFlagMetadata, LogLevel } from '@flagship.io/js-sdk'
import { noVisitorMessage } from './constants'
import { log } from './utils'

export class Flag<T> implements IFlag<T> {
    private _defaultValue:T
    constructor (defaultValue:T) {
      log(LogLevel.WARNING, noVisitorMessage, 'GetFlag')
      this._defaultValue = defaultValue
    }

    getValue (): T {
      log(LogLevel.WARNING, noVisitorMessage, 'getValue')
      return this._defaultValue
    }

    exists ():boolean {
      log(LogLevel.WARNING, noVisitorMessage, 'exists')
      return false
    }

    userExposed (): Promise<void> {
      log(LogLevel.WARNING, noVisitorMessage, 'userExposed')
      return Promise.resolve()
    }

    get metadata ():IFlagMetadata {
      log(LogLevel.WARNING, noVisitorMessage, 'metadata')
      return new FlagMetadata({
        campaignId: '',
        campaignType: '',
        isReference: false,
        variationGroupId: '',
        variationId: ''
      })
    }
}

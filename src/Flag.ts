import { FlagMetadata, IFlag, IFlagMetadata, LogLevel } from '@flagship.io/js-sdk'
import { noVisitorMessage } from './constants'
import { log } from './utils'

export class Flag<T> implements IFlag<T> {
    private _defaultValue:T
    constructor (defaultValue:T) {
      log(LogLevel.ERROR, noVisitorMessage, 'GetFlag')
      this._defaultValue = defaultValue
    }

    value (): T {
      log(LogLevel.ERROR, noVisitorMessage, 'exists')
      return this._defaultValue
    }

    exists ():boolean {
      log(LogLevel.ERROR, noVisitorMessage, 'exists')
      return false
    }

    userExposed (): Promise<void> {
      log(LogLevel.ERROR, noVisitorMessage, 'userExposed')
      return Promise.resolve()
    }

    get metadata ():IFlagMetadata {
      log(LogLevel.ERROR, noVisitorMessage, 'metadata')
      return new FlagMetadata({
        campaignId: '',
        campaignType: '',
        isReference: false,
        variationGroupId: '',
        variationId: ''
      })
    }
}

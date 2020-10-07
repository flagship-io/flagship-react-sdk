import { DecisionApiCampaign } from '@flagship.io/js-sdk';

const initialModifications:DecisionApiCampaign[] = [
    {
        id: 'bqpvn31q00j00ad7ite0',
        variationGroupId: 'bqpvoab5mf4g19rr788g',
        variation: {
            id: 'bqpvoab5mf4g19rr789g',
            modifications: { type: 'JSON', value: { color: '#55342F' } },
            reference: false
        }
    },
    {
        id: 'bqtvkps9h7j02m34fj2g',
        variationGroupId: 'bqtvkps9h7j02m34fj3g',
        variation: {
            id: 'bqtvkps9h7j02m34fj40',
            modifications: { type: 'JSON', value: { Buttoncolor: null } },
            reference: true
        }
    },
    {
        id: 'bsq046crms2g1jsvtb20',
        variationGroupId: 'bsq046crms2g1jsvtb30',
        variation: {
            id: 'bsq046crms2g1jsvtb40',
            modifications: {
                type: 'JSON',
                value: { array: [1, 2, 3], complex: { carray: [{ cobject: 0 }] }, object: { value: 123456 } }
            },
            reference: false
        }
    },
    {
        id: 'btd44nrr63bg38jf1mn0',
        variationGroupId: 'btd44nrr63bg38jf1mo0',
        variation: {
            id: 'btd44nrr63bg38jf1mp0',
            modifications: { type: 'FLAG', value: { navbarTitle: false } },
            reference: false
        }
    },
    {
        id: 'btfmlr3r63bg23e7jkh0',
        variationGroupId: 'btfmlr3r63bg23e7jki0',
        variation: {
            id: 'btfmlr3r63bg23e7jkj0',
            modifications: { type: 'FLAG', value: { 'ultimate release': '1.1.1' } },
            reference: false
        }
    }
];
export default initialModifications;

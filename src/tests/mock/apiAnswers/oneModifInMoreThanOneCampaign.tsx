import { DecisionApiResponseData } from '@flagship.io/js-sdk';
import { vId } from '../env';

const oneModifInMoreThanOneCampaign: DecisionApiResponseData = {
    visitorId: vId,
    campaigns: [
        {
            id: 'blntcamqmdvg04g371f0',
            variationGroupId: 'blntcamqmdvg04g371h0',
            variation: {
                id: 'blntcamqmdvg04g371hg',
                modifications: {
                    type: 'FLAG',
                    value: {
                        psp: 'dalenys'
                    }
                }
            }
        },
        {
            id: 'bmjdprsjan0g01uq2crg',
            variationGroupId: 'bmjdprsjan0g01uq2csg',
            variation: {
                id: 'bmjdprsjan0g01uq2ctg',
                modifications: {
                    type: 'JSON',
                    value: {
                        algorithmVersion: 'new'
                    }
                }
            }
        },
        {
            id: 'bmjdprsjan0g01uq2ceg',
            variationGroupId: 'bmjdprsjan0g01uq2ceg',
            variation: {
                id: 'bmjdprsjan0g01uq1ctg',
                modifications: {
                    type: 'JSON',
                    value: {
                        algorithmVersion: 'yolo2',
                        psp: 'yolo',
                        hello: 'world'
                    }
                }
            }
        }
    ]
};

export default oneModifInMoreThanOneCampaign;

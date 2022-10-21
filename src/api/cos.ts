import { GET } from 'boot/axios'
import COS from 'cos-js-sdk-v5'

export let TENCENT_COS_BUCKET = ''
export let TENCENT_COS_REGION = ''
export const getTemporaryToken = (duration: number = 600, prefix: string = "*") => GET(`/tencent-cos/temporary-token?duration=${duration}&prefix=${prefix}`)
export const getAccessUrl = (duration: number = 600, key: string = "*") => GET(`/tencent-cos/access?duration=${duration}&key=${key}`)

export const getCOSInstance = () => {
    return new COS({
        getAuthorization: function (options: any, callback: any) {
            getTemporaryToken().then((res: any) => {
                let data = res.data
                callback({
                    TmpSecretId: data.temporarySecretId,
                    TmpSecretKey: data.temporarySecretKey,
                    XCosSecurityToken: data.sessionToken,
                    StartTime: data.startTime,
                    ExpiredTime: data.expiredTime,
                });
            })
        }
    })
}

export const sliceUploadFile = async(file: any, prefix: string = "") => {
    if (TENCENT_COS_BUCKET === '' || TENCENT_COS_REGION === '') {
        let res:any = await GET(`/tencent-cos/config`)
        TENCENT_COS_BUCKET = res.data.bucket
        TENCENT_COS_REGION = res.data.region
    }

    return getCOSInstance().sliceUploadFile({
        Body: file,
        Bucket: TENCENT_COS_BUCKET,
        Key: `${prefix}/${Date.now().toString(32)}_${file.name}`,
        Region: TENCENT_COS_REGION,
    })
}




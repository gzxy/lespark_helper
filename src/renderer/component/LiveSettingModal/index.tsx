import { FC, useCallback, useState, useEffect } from 'react'
import { useMount } from 'ahooks'
import { Modal, Input, message, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UploadChangeParam } from 'antd/es/upload';
import cx from 'classnames'
import { RootState } from '../../store/index'
import styles from './liveSetting.scss'
import { closeLiveSettingModal } from '../../store/global'
import { createLive } from '../../store/live'
import apis from '../../services/live'


const LiveSettingModal: FC = () => {
   const {
    global: {
      isLiveSettingModalShow,
      liveSettingOptions
    },
  } = useSelector((s: RootState) => s)
  const dispatch = useDispatch()
  const [liveTitle, setLiveTitle] = useState('')
  const [liveDec, setLiveDec] = useState('')
  const [isExamine, setisExamine] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(()=>{
   if(!isLiveSettingModalShow) {
      setImageUrl('')
   }
  }, [isLiveSettingModalShow])

  const handleCancel = useCallback(()=>{
   dispatch(closeLiveSettingModal())
  },[])

  const handleLiveTitleChange = useCallback((value)=>{
   setLiveTitle(value.target.value+'')
  },[])
  const handleLiveDecChange = useCallback((value)=>{
   setLiveDec(value.target.value+'')
  },[])

  const handleToBeginLive = useCallback(async()=>{
      if(isExamine || !imageUrl) return
      setisExamine(true)

     const res =  await apis.openLive({
         is_secret_live: 0,
         is_audio: 0,
         live_show_type: 2,
         live_management_type: 3,
         view_type: 'video',
         name: liveTitle,
         topic_id: liveDec,
         select_tag: liveDec,
         pic: ''
      })
      setisExamine(false)
      if (res.error !== 0 ) {
        message.error(res.msg)
        return 
      }
      dispatch(createLive(res.data))
      liveSettingOptions.beginToLiveFn && liveSettingOptions.beginToLiveFn(res.data)
      console.log('res=====>', res);
      
      // setTimeout(()=>{
         dispatch(closeLiveSettingModal())
         setisExamine(false)
      // },2000)
  },[isExamine,imageUrl,liveSettingOptions, liveTitle, liveDec])

  const uploadButton = (
   <div>
     {loading ? <LoadingOutlined /> : <PlusOutlined />}
   </div>
 );

 const getBase64 = (img: RcFile, callback: (url: string) => void) => {
   const reader = new FileReader();
   reader.addEventListener('load', () => callback(reader.result as string));
   reader.readAsDataURL(img);
 };

 const beforeUpload = (file: RcFile) => {
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
   if (!isJpgOrPng) {
     message.error('请上传 JPG/PNG 文件!');
   }
   const isLt20M = file.size / 1024 / 1024 < 20;
   if (!isLt20M) {
     message.error('图片不能超过20MB!');
   }
   return isJpgOrPng && isLt20M;
 };

 const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
   if (info.file.status === 'uploading') {
     setLoading(true);
     return;
   }
   console.log('info.file===>', info.file);
   
   // if (info.file.status === 'done') {
     // Get this url from response in real world.
     getBase64(info.file.originFileObj as RcFile, (url) => {
       setLoading(false);
       setImageUrl(url);
     });
   // }
 };

   return (
      <Modal title="" centered={true} footer={null} wrapClassName={styles.LiveSettingModal} destroyOnClose={true} open={isLiveSettingModalShow} onCancel={handleCancel}>
         <div className={styles.modalHeader}>直播间设置</div>
         <div className={styles.modalBody}>
            <div className={styles.settingItem}>
               <span className={styles.settingItemLeft}>直播间标题</span>
               <Input placeholder="#请输入直播间标题" defaultValue={liveSettingOptions.liveTitle} maxLength={12} className={styles.settingInput} bordered={false} onChange={handleLiveTitleChange} />
            </div>
            <div className={styles.settingItem}>
               <span className={styles.settingItemLeft}>直播间话题</span>
               <Input placeholder="#请输入直播间话题" defaultValue={liveSettingOptions.liveDec} maxLength={12} className={styles.settingInput} bordered={false} onChange={handleLiveDecChange} />
            </div>
            <div className={styles.settingUploadItem}>
               <span className={styles.settingItemLeft}>直播间封面</span>
               
               <Upload
                  name="avatar"
                  listType="picture-card"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  >
                  {imageUrl ? <img src={imageUrl} alt="" className={styles.uploadImage} /> : uploadButton}
               </Upload>
            </div>

            <div className={ cx({
               [styles.beginLiveBtn]: true,
               [styles.actived]: imageUrl && !isExamine
            })} onClick={handleToBeginLive}>{isExamine?'审核中...':'开播'} </div>
         </div>
      </Modal>)
}


export default LiveSettingModal
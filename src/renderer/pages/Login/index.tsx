import { shell } from 'electron'
import { FC, useCallback, useState, useMemo } from 'react'
import { useMount } from 'ahooks'
import { useHistory } from 'react-router-dom'
import { Button, message,Space, Select,Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import md5 from "md5";
import apis from '../../services/login'
import { RootState } from '../../store/index'
import { setUserInfo } from '../../store/login'
import { getToken } from '../../utils/token'
import { getResourcePath } from '../../utils/index'
import styles from './login.scss'
import TrafficLight from '../../component/TrafficLight'

const logo = getResourcePath('lespark_logo.png')
const hideIcon = getResourcePath('hide.png')
const showIcon = getResourcePath('show.png')
const checkBoxIcon = getResourcePath('checkBox.png')
const checkedIcon = getResourcePath('checked.png')

const LoginPage: FC = () => {
	const history = useHistory();
	const dispatch = useDispatch()
	const {
		login: {
				userInfo,
		},
	} = useSelector((s: RootState) => s)
	const { Option } = Select;
	const [messageApi, contextHolder] = message.useMessage();
	const [activedType, setActivedType] = useState(1)
	const [region, setRegion] = useState(86)
	const [phone, setPhone] = useState('')
	const [code, setCode] = useState('')
	const [account, setAccount] = useState('')
	const [reference, setReference] = useState('')
	const [password, setPassword] = useState('')
	const [codeFlag, setCodeFlag] = useState(false)
	const [isPasswordShow, setIsPasswordShow] = useState(false)
	const [isRead, setIsRead] = useState(false)
	const [codeTime, setCodeTime] = useState(59)
	const [phoneList, setPhoneList] = useState([
		{ value: 86, label: '+86', region: '中国大陆' },
		{ value: 852, label: '+852', region: '中国香港' },
		{ value: 853, label: '+853', region: '中国澳门' },
		{ value: 886, label: '+886', region: '中国台湾' },
		{ value: 1, label: '+1', region: '美国' },
	])

	useMount(() => {
		console.log('userInfo====>',userInfo);
		const token = getToken()
		if(token) {
				history.push("/")
				return
		}
		const localAccount = localStorage.getItem('localAccount')
		const localPhoneJSON = localStorage.getItem('localPhone') 
		if(localAccount) {
				setAccount(localAccount)
		}
		if(localPhoneJSON) {
				const localPhone = JSON.parse(localPhoneJSON)
				setPhone(localPhone.phone)
				setRegion(+localPhone.region)
		}
		
	})


	const phoneInput= useMemo(()=>{
		return phoneList.map(item=>{
				return (
				<Option value={item.value} label={item.label} key={item.value}>
					<div className={styles.inputPhoneOption}>
							<span aria-label={item.label}>{item.region}</span>
							<span>{item.label}</span>
					</div>
				</Option>)
		})
	},[])

   const codeBtnText = useMemo(()=>{
      const t = codeTime>=10? codeTime: '0'+codeTime
      return `重新获取(${t}s)`
   },[codeTime])

   const handleLogin =useCallback( async ()=>{
      if(!isRead) return
      let res = {
         error: 0,
         data: {},
         msg: ''
      }
      if(activedType === 2) {
         res =  await apis.passwordLogin({
            phone: account,
            password:  md5(password),
            // luid: '',
            shumei_device_id: '',
            verion: '7.9.6.1002'
         })
         
      }else{
         res =  await apis.codeLogin({
            code: code,
            reference_id: reference,
            zone: region+'',
            phone_num: phone,
            use_telesign: '1',
            // luid: '',
            sms_code_version: '2'
         })
      }

      console.log('res====>',res);

      if(res.error !== 0) {  
         message.destroy()
         message.error(res.msg)
         /*
         messageApi.open({
            type: 'error',
            content: res.msg
         });*/
      }else{
         if(activedType === 2) {
            localStorage.setItem('localAccount', account)
         }else{
            localStorage.setItem('localPhone', JSON.stringify({region: region,phone: phone}))
         }
         
         history.push("/")
         dispatch(setUserInfo(res.data))

      }

   },[region,phone,code,account,password,isRead,activedType,reference])

   const handleSelectType = useCallback((type)=>{
      setActivedType(type)
   },[])

   const handleRegionChange=useCallback((item)=>{
      console.log('handleRegionChange===>', item);
      setRegion(item)
   }, [])

   const handlePhoneChange = useCallback((value)=>{
      console.log('handleRegionChange===>', value);
      setPhone(value.target.value+'')
   }, [])

   const handleCodeChange= useCallback((value)=>{
      setCode(value.target.value+'')
   }, [])

   const handleAccountChange = useCallback((value)=>{
      setAccount(value.target.value+'')
   }, [])

   const handlePasswordChange = useCallback((value)=>{
      setPassword(value.target.value+'')
   }, [])

   const handleSendCode = useCallback(async ()=>{
      if(codeFlag) return 
    let ret =  await apis.getCode({
         phone_number: `${region}${phone}`,
         source: 'login',
         code_type: 0
      })
			console.log('handleSendCode====>',ret);
			if (ret.error !== 0) {
				message.error('获取验证码失败，请使用其它登录方式')
			} else {
				setReference(ret.data.reference_id)
			}
      setCodeTime(59)
      setCodeFlag(true)
      timeout(59)
   },[codeFlag,region,phone])

   const timeout = useCallback((time)=>{
      const t = time--
      setCodeTime(t)
      if(time < 0) {
         setCodeFlag(false)
         return
      }
      console.log('time===>',t);
      
      setTimeout(()=>{
         timeout(time)
      },1000)
   },[])

   const handleShowChange = useCallback(()=>{
      setIsPasswordShow(!isPasswordShow)
   },[isPasswordShow])


   const handleReadChange = useCallback(()=>{
      setIsRead(!isRead)
   },[isRead])

   const handleJumpWeb = useCallback(type =>{
      const url = type === 1? 'https://h5.lestory.cn/rule_privacy?rule_type=using' : 'http://h5.lespark.cn/rule_privacy'
      shell.openExternal(url)
   }, [])

   return (
		 <>
		  <TrafficLight/>
			<div className={styles.login}>
					{contextHolder}
					<div className={styles.loginBox}>
							<img className={styles.logo} src={`file://${logo}`} alt="logo" />
							<span className={styles.loginTitle}>LesPark直播伴侣</span>
							<div className={styles.loginComBox}>
								<div className={styles.loginType}>
										<div  className={cx({
										[styles.loginTypeItem]: true,
										[styles.leftBorder]: true,
										[styles.actived]: activedType === 1,
										})} onClick={()=>handleSelectType(1)}>手机号登录</div>
										<div className={cx({
										[styles.loginTypeItem]: true,
										[styles.actived]: activedType === 2,
										})} onClick={()=>handleSelectType(2)}>密码登录</div>
								</div>
								{activedType === 1 && (<div className={styles.inputPhoneBox}>
										<Select
											defaultValue={region}
											style={{ width: 80 }}
											bordered={false}
											optionLabelProp="label"
											popupClassName='inputPhoneOptionBox'
											onChange={handleRegionChange}
										>
											{phoneInput}
										</Select>
										<Input placeholder="手机号" defaultValue={phone} bordered={false} maxLength={11} onChange={handlePhoneChange} />
								</div>
								)}
								{activedType === 1 && (<div className={styles.inputPhoneBox}>
										<Input placeholder="验证码" defaultValue={code} className={styles.codeInput} bordered={false} maxLength={11} onChange={handleCodeChange} />
										<div className={ cx({
											[styles.codeBtn]: true,
											[styles.isLoading]: codeFlag
										})} onClick={handleSendCode}>
											{codeFlag? codeBtnText : '获取验证码'}
										</div>
								</div>)}
								{activedType === 2 && (<div className={styles.inputPhoneBox}>
										<Input placeholder="请输入手机号或邮箱" defaultValue={account} className={styles.emailInput} bordered={false} onChange={handleAccountChange} />
								</div>)}

								{activedType === 2 && (<div className={styles.inputPhoneBox}>
										<Input placeholder="请输入密码" defaultValue={password} type={isPasswordShow? 'text' : 'password'} className={styles.passwordInput} bordered={false} onChange={handlePasswordChange} />
										<img className={styles.showIcon} src={isPasswordShow? `file://${showIcon}` : `file://${hideIcon}`} alt="" onClick={handleShowChange} />
								</div>)}
							</div>
							<div className={styles.userTip}>
								<img className={styles.tipCheckBox} src={isRead? `file://${checkedIcon}` : `file://${checkBoxIcon}`} alt="" onClick={handleReadChange} />
								<span className={styles.tipText}>我已仔细阅读并同意 
										<span className={styles.tipLink} onClick={()=>handleJumpWeb(1)}>《LesPark使用条款》</span>和
										<span className={styles.tipLink} onClick={()=>handleJumpWeb(2)}>《隐私政策》</span></span>
							</div>
							<div className={cx({
											[styles.loginBtn]: true,
											[styles.canLogin]: isRead && (activedType === 1 && phone && code || activedType === 2 && account && password)
										})} onClick={handleLogin}>登录</div>
					</div>
				</div>
			</>
      
   )
}



export default LoginPage
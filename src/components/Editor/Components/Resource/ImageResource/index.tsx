// @ts-nocheck
import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { useDropDown } from './dropDown';
import useAddObject from '../../../../Draw/hooks/useAddObject';
import { addImageApi, getImageList, postUploadImage } from '../../../../../api/image';
import { Context } from '../../../../Draw';
import { Context as EditorContext } from '../../../Context'
import useToast from '../../../../Draw/hooks/useToast';

const ImageResource = () => {
  const {setLoading} = useContext(EditorContext)
  const toast = useToast()
  const {canvas} = useContext(Context)
  const EDIT_IMAGE_LIST = sessionStorage.getItem('EDIT_IMAGE_LIST')
  const userInfo = localStorage.getItem('userInfo')
  const [uploading, setUploading] = useState(false)
  const phone = userInfo ? JSON.parse(userInfo).phone : '15612868761';
  const {addImage} = useAddObject()
  const searchRef = useRef('')

  const [list, setList] = useState(EDIT_IMAGE_LIST ?
    JSON.parse(sessionStorage.getItem('EDIT_IMAGE_LIST')) :
    [])
  const {run} = useDropDown()


  useEffect(() => {
    queryList()
  }, [])

  useEffect(() => {
    if (!canvas) return
    canvas.on('drop', onDrop)
    canvas.on('dragover', onDragover)
    return () => {
      canvas.off('drop', onDrop)
      canvas.off('dragover', onDragover)
    }
  }, [canvas])

  // 添加画布的拖拽事件监听器
  const onDrop = ({e}) => {
    e.preventDefault()
    const imageUrl = e.dataTransfer.getData('text/plain');
    // 画布元素距离浏览器左侧和顶部的距离
    let offset = {
      left: canvas.getSelectionElement().getBoundingClientRect().left,
      top: canvas.getSelectionElement().getBoundingClientRect().top
    }
    // 鼠标坐标转换成画布的坐标（未经过缩放和平移的坐标）
    let point = {
      x: e.x - offset.left,
      y: e.y - offset.top,
    }
    // 转换后的坐标，restorePointerVpt 不受视窗变换的影响
    let pointerVpt = canvas.restorePointerVpt(point)
    addImage(imageUrl, {}, img => {
      img.set({
        left: pointerVpt.x - img.getScaledWidth() / 2,
        top: pointerVpt.y - img.getScaledHeight() / 2,
      })
    })
  }
  // 阻止画布的默认拖拽行为
  const onDragover = ({e}) => {
    e.preventDefault()
  }
  const onClickMore = (e: any, item: any) => {
    run(e, {...item, callback: queryList})
  }
  /**
   * 获取图片数据
   */
  const queryList = async () => {
    try {
      const res = await getImageList({phone, pageIndex: 1, pageSize: 500})
      sessionStorage.setItem('EDIT_IMAGE_LIST', JSON.stringify(res))
      setList(res)
    } catch (err) {
      console.log(err)
    }
  }
  /**
   * 上传文件
   * @param e
   */
  const onUploadFile = async (e: any) => {
    if (uploading) return
    const fileList = [...e.target.files]
    try {
      setUploading(true)
      setLoading(true)
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        if (!/(png|jpg|jpeg)/g.test(file.type)) continue
        const res = await postUploadImage(file)
        await addImageApi({
          phone,
          imgSrc: res.url,
          stockName: file.name
        })
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
    e.target.value = ''
    await queryList()
    setUploading(false)
    setLoading(false)
  }

  const onDragStart = e => {
    e.dataTransfer.setData('text/plain', e.target.src);
  }
  return (
    <div className={styles.imageResource}>
      {/*<div className={styles.searchBox}>*/}
      {/*  <input type='text' placeholder='请输入' onChange={e => searchRef.current = e.target.value}/>*/}
      {/*  <img src="https://ossprod.jrdaimao.com/file/1690356901972689.svg" alt=""/>*/}
      {/*</div>*/}
      <div className={styles.uploadFile}>
        <span>{uploading ? '上传中...' : '上传文件'}</span>
        <input multiple disabled={uploading} type="file" accept='.png,.jpg,.jpeg' onChange={onUploadFile}/>
      </div>
      {
        !list.length ? <div className={styles.empty}>
          <img src="https://ossprod.jrdaimao.com/file/169035729200810.png" alt=""/>
          <p>还没有文件哦~</p>
        </div> : null
      }
      {
        list.length ? <div className={styles.fileList} id='img-file-list'>
          {
            list.map((item) => {
              return <div
                key={item._id}
                className={styles.fileListItem}
              >
                <img
                  onDragStart={onDragStart}
                  onError={e => {
                    e.target.style.cursor = 'not-allowed'
                    e.target.style.pointerEvents = 'none'
                    e.target.src = 'https://juranapp-prod.oss-cn-beijing.aliyuncs.com/file/1639966318079/picture'
                  }}
                  onClick={() => addImage(item.imgSrc)}
                  className={styles.image}
                  src={item.imgSrc}
                  alt=""
                />
                <img
                  onClick={(e) => onClickMore(e, item)}
                  className={styles.more}
                  src="https://ossprod.jrdaimao.com/file/1690363754666532.svg"
                  alt=""
                />
              </div>
            })
          }
        </div> : null
      }
    </div>
  )
}

export default ImageResource

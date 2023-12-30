import threading
import time
import os
import pygame

import os
os.environ['KMP_DUPLICATE_LIB_OK']='True'

import cv2
import numpy as np
import torch
from PIL import Image
from datetime import datetime
from torchvision import datasets, transforms
from ultralytics import YOLO
import pandas as pd
import timeit

import requests
import json



class SoundPlayer:
    def __init__(self):
        self.event = threading.Event()
        self.event.set()  # Initially set to True

    def play_sound(self, file):
        pygame.mixer.init()
        pygame.mixer.music.load(file)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():  # Wait until music is finished
            pass
        self.event.set()  # Set event to True when done playing

            
    def loading_env_sound(self):
        if self.event.is_set():  # Check if no sound is playing (event is True)
            self.event.clear()   # Reset event to False before starting new sound
            threading.Thread(target=self.play_sound, args=('D:/hanium-final-service/files/environments_setting.mp3',), daemon=True).start()
    
    def alert_sound(self):
        if self.event.is_set():  # Check if no sound is playing (event is True)
            self.event.clear()   # Reset event to False before starting new sound
            threading.Thread(target=self.play_sound, args=('D:/hanium-final-service/files/warning_short.mp3',), daemon=True).start()
            
    


class ObjectDetectionWithCLS:
    def __init__(self):
        """Setting the enviroment"""
        sound_player.loading_env_sound()
        # model load
        self.yolo = YOLO('D:/hanium-final-service/files/yolov8_0905_CCTVSOD.pt')
        self.cls_model = torch.load('D:/hanium-final-service/files/1103_CLS_Additional_SNetv2x15_AdamW.pt', map_location=torch.device('cpu')).eval()
        self.id=None
        # number label to leash label
        self.idx_to_classes = {0: 'with', 1: 'without'}
        
        # preprocess of input
        self.preprocess = transforms.Compose([
            transforms.Resize((224, 224)),  # resize
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]) # normalize
        ])
        
        # save data temporaily
        self.dogs_dict={}
    
    def xywh_to_xyxy(self,x, y, w, h):
        """xywh->xyxy"""
        x1 = x -w/2
        y1 = y -h/2
        x2 = x + w/2
        y2 = y + h/2
        return x1, y1, x2, y2
    
    def xyxy_to_xywh(self,x1, y1, x2, y2):
        """xyxy->xywh"""
        x=(x1+x2)/2
        y=(y1+y2)/2
        w=x2-x1
        h=y2-y1
        return x, y, w, h
    
    def crop(self,pnt,margin=0.3):
        """Crop image with margin"""
        x,y,w,h=self.xyxy_to_xywh(pnt[0],pnt[1],pnt[2],pnt[3])
        w1=w+w*margin
        h1=h+h*margin
        return self.xywh_to_xyxy(x,y,w1,h1)
    
    def yolo_action(self, frame):
        """ EXECUTE YOLO """
        self.results = self.yolo.track(frame,conf=0.6,tracker="bytetrack.yaml",persist=True)
        self.annotated_frame = self.results[0].plot()
        
        # id가 지정되지 않은 경우 패스
        if self.results[0].boxes.id == None:
            return
        
        self.xyxy=self.results[0].boxes.xyxy.int().tolist()
        self.conf=self.results[0].boxes.conf.float().tolist()
        self.id=self.results[0].boxes.id.int().tolist()
        
        #return self.xyxy, self.conf, self.id

                

    def cls_action(self,img_array,probs=True):
        """ EXECUTE CLS """
        with torch.no_grad():
            input_tensor = self.preprocess(Image.fromarray(img_array))
            input_batch = input_tensor.unsqueeze(0)
            output=self.cls_model(input_batch)
            if probs:
                return torch.argmax(output[0]).item(),output[0]
            else: 
                return torch.argmax(output[0]).item()
            
    #cap_source=D:/track_ver1/files/tracking_test5.mp4 
    #cap_source=D:/track_ver1/files/tracking_test7.mp4
    #cap_source=cv2.CAP_DSHOW+1 
    #cap_source=cv2.CAP_DSHOW+0
    def execute(self, cap_source='D:/hanium-final-service/files/without.mp4'):
        cap=cv2.VideoCapture(cap_source)
        while cap.isOpened():
            success, frame = cap.read()
            if success:
                start_t = timeit.default_timer() # FPS 연산
                
                self.yolo_action(frame)
                if self.id==None: continue
                for key in self.id:
                    if key not in self.dogs_dict.keys(): # 새로운 강아지가 탐지될 때
                        self.dogs_dict[key]=[[],[],[],[]]
                        
                for i in range(len(self.results[0])):
                    xmin,ymin,xmax,ymax=tuple(map(int,self.crop(self.xyxy[i])))
                    img_array=frame[max(0,ymin):min(frame.shape[0],ymax),max(0,xmin):min(frame.shape[1],xmax),:]
                    ############################ CLS ############################################
                    ret=self.cls_action(img_array,probs=True)
                    print(self.idx_to_classes[ret[0]])
                    self.dogs_dict[self.id[i]][0].append(img_array) # crop된 프레임
                    self.dogs_dict[self.id[i]][1].append(self.conf[i]) # 개 확률
                    self.dogs_dict[self.id[i]][2].append(ret[1][1]) # 미착용 확률
                    self.dogs_dict[self.id[i]][3].append(ret[0]) # 0(착용) or 1(미착용)
                ################################## CHECK FPS ####################################
                terminate_t = timeit.default_timer()
                FPS = int(1./(terminate_t - start_t ))
                cv2.putText(self.annotated_frame,f'FPS: {FPS}',(50,50),cv2.FONT_HERSHEY_SIMPLEX,1,(225,225,225),2)
                ####################### Real-time Annotated Video Streaming #####################
                cv2.imshow("YOLOv8 Tracking", cv2.resize(self.annotated_frame, dsize=(640, 640)))
                if cv2.waitKey(1) & 0xFF == ord("q"):
                    break
                ##################################################################################
            else:
            # Break the loop if the end of the video is reached
                break   
        cap.release()
        cv2.destroyAllWindows()
        
    def check_and_post(self):
        last_lengths = {}
        while True:
            for key in list(self.dogs_dict.keys()):
                current_length = len(self.dogs_dict[key][0])
                if key not in last_lengths:
                    last_lengths[key] = (current_length, time.time())
                else:
                    if current_length == last_lengths[key][0] and time.time() - last_lengths[key][1] >= 5:
                        print(f"Dog number {key} hasn't been detected during 5 seconds .")
                        if len(self.dogs_dict[key][3])==0: continue
                        if np.mean(self.dogs_dict[key][3])>0.5:
                            name=datetime.now().strftime('%y%m%d%H%M%S')+'_without'
                            prob_off_leash=max(self.dogs_dict[key][2]) # 미착용 확률
                            choice=self.dogs_dict[key][2].index(prob_off_leash)
                            image=self.dogs_dict[key][0][choice]
                            conf=self.dogs_dict[key][1][choice] # 개확률
                            sound_player.alert_sound()
                        else:
                            name=datetime.now().strftime('%y%m%d%H%M%S')+'_with'
                            prob_on_leash=min(self.dogs_dict[key][2])
                            choice=self.dogs_dict[key][2].index(prob_on_leash)
                            image=self.dogs_dict[key][0][choice]
                            prob_off_leash=1-prob_on_leash
                            conf=self.dogs_dict[key][1][choice] # 개확률
                            
                        cv2.imwrite(f'D:/hanium-final-service/bins/{name}_dogie{key}.jpg', image)    
                        image_file = open(f'D:/hanium-final-service/bins/{name}_dogie{key}.jpg', 'rb')
                        
                        # 데이터 설명
                        # prob_dog//prob_off_leash//image_file//conf
                        
                        ###########################################여기서부터 POST#######################################################
                        # # POST 요청을 보낼 URL 설정
                        # url = "https://okaydogie-api.store/api/informations/"  # 이미지를 업로드할 엔드포인트 URL로 수정
                        # headers = {
                        #     'Content-Type': 'application/json', 
                        #     }
                        # # POST 요청에 첨부할 데이터 및 파일 설정
                        # data = {
                        #     "camera": 1,
                        #     "prob_dog": float(conf),
                        #     "prob_leash": float(prob_off_leash),
                        #     "location": "SeSAC",
                        #     "add": "(전)100P_032"
                        # }
                        # files = {
                        #     "image": ('jiwon.jpg', image_file, 'image/jpeg')  # 이미지 파일 업로드 설정
                        # }
                        # # POST 요청 보내기
                        # response = requests.post(url, data=data, files=files)
                        # # 서버 응답 확인
                        # if response.status_code == 201:  # 201 Created: 데이터가 성공적으로 생성됨
                        #     response_data = response.json()
                        #     print("데이터가 성공적으로 생성되었습니다.")
                        #     print("응답 데이터:", response_data)
                        # else:
                        #     print("데이터 생성에 실패했습니다.")
                        #     print("응답 상태 코드:", response.status_code, response.content)
                        # # 파일 닫기
                        # image_file.close()
                        #########################################여기까지 POST#######################################################
                        del self.dogs_dict[key]
                        del last_lengths[key] 
                    elif current_length != last_lengths[key][0]:
                        print(f'dog id{key} : {current_length}번 탐지됨')
                        last_lengths[key] = (current_length, time.time())  
            time.sleep(1)


if __name__ == '__main__': 
    sound_player = SoundPlayer()
    instnc = ObjectDetectionWithCLS()
    #instnc.execute()
    threading.Thread(target=instnc.check_and_post).start()
    threading.Thread(target=instnc.execute).start()
    
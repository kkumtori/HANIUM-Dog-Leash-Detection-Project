from flask import Flask, Response
from functools import wraps
import pymysql
import json
from flask_cors import CORS
from threading import RLock
import base64
import cv2

db = pymysql.connect(host="localhost", user="dogie", passwd="dogie123!@#", db="okaydogie", charset='utf8')
db.autocommit(True)
lock = RLock()

def as_json(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        res = f(*args, **kwargs)
        res = json.dumps(res, ensure_ascii=False, indent=4).encode('utf8')
        return Response(res, content_type='application/json; charset=utf-8')
    return decorated_function
try:
  cur = db.cursor()
  app = Flask(__name__)
  app.config['JSON_AS_ASCII'] = False
  CORS(app, resources={r'*': {'origins': '*'}})
  lock = RLock()
  @app.route("/api/informations", methods=['GET'])
  def informations():
    with lock:
      sql = f"""
          SELECT 
            c.location, 
            d.image, 
            DATE_FORMAT(d.dataTime, '%Y-%m-%d %H:%i:%S') as dateTime, 
            d.state,
            d.seq  -- seq 필드 추가
          FROM data AS d 
          JOIN camera AS c ON c.camera_id = d.camera_id
          ORDER BY d.dataTime DESC;
      """
      cur.execute(sql)
      columns = cur.description 
      result = []
      for value in cur.fetchall():
          row = {columns[index][0]:column for index, column in enumerate(value)}
          
          # image 필드가 있는 경우 Base64 형식의 문자열로 변환
          if 'image' in row and isinstance(row['image'], bytes):
              row['image'] = base64.b64encode(row['image']).decode('utf-8')
              
          result.append(row)
    return result

  @app.route("/api/dounut", methods=['GET'])
  def dounut():
    with lock:
      sql = f"""
                SELECT 
                    COUNT(*) AS all_count,
                    COALESCE(SUM(CASE WHEN state = 1 THEN 1 ELSE 0 END), 0) AS state_1_count,
                    COALESCE(SUM(CASE WHEN state = 2 THEN 1 ELSE 0 END), 0) AS state_2_count,
                    COALESCE(SUM(CASE WHEN state = 3 THEN 1 ELSE 0 END), 0) AS state_3_count
                FROM data
                WHERE DATE(datatime) = CURDATE();
              """
      cur.execute(sql)

      columns = cur.description 
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in cur.fetchall()]
    return result



  @app.route("/api/main_time", methods=['GET'])
  def main_time():
    with lock:
      sql = f"""
                SELECT 
                    hour_group,
                    alarm_count
                FROM (
                    SELECT 
                        DATE_FORMAT(datatime, '%H') AS hour_group,
                        COUNT(*) AS alarm_count
                    FROM data
                    WHERE DATE(datatime) = CURDATE()
                    GROUP BY DATE_FORMAT(datatime, '%H')
                ) AS subquery
                ORDER BY hour_group;
              """

      cur.execute(sql)

      columns = cur.description 
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in cur.fetchall()]
    return result

  @app.route("/api/main_location", methods=['GET'])
  def main_location():
    with lock:
      sql = f"""
              SELECT
                  c.location,
                  COUNT(*) AS location_count
                FROM
                  camera c
                JOIN
                  data d ON c.camera_id = d.camera_id
                WHERE
                  DATE(d.dataTime) = CURDATE() -- 오늘 날짜에 해당하는 데이터만 선택
                GROUP BY
                  c.location;
              """

      cur.execute(sql)

      columns = cur.description 
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in cur.fetchall()]
    return result



  @app.route("/api/main_state/<seq>/<state>", methods=['GET'])
  def main_state(seq, state):
    with lock:
      print('seq',seq)
      print('state',state)

      sql = f"UPDATE data SET state = {state} WHERE seq = {seq};"

      cur.execute(sql)


      columns = cur.description 
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in cur.fetchall()]

    return result


  @app.route("/api/hour_location_graph", methods=['GET'])
  def hour_location_graph():
    with lock:
      sql = f"""
                SELECT 
                  c.location,
                  DATE_FORMAT(d.datatime, '%Y-%m-%d %H') AS hour,
                  COUNT(*) AS count
                FROM camera c
                JOIN data d ON c.camera_id = d.camera_id
                GROUP BY c.location, hour
                ORDER BY c.location, hour;
              """

      cur.execute(sql)

      columns = cur.description 
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in cur.fetchall()]

    return result


  @app.route("/api/day_location_graph", methods=['GET'])
  def day_location_graph():
    with lock:
      sql = f"""
                SELECT 
                  c.location,
                  DATE_FORMAT(d.datatime, '%Y-%m-%d') AS day,
                  COUNT(*) AS count
                FROM camera c
                JOIN data d ON c.camera_id = d.camera_id
                GROUP BY c.location, day
                ORDER BY c.location, day;
              """

      cur.execute(sql)

      columns = cur.description 
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in cur.fetchall()]

    return result


  @app.route("/api/month_location_graph", methods=['GET'])
  def month_location_graph():
    with lock:
      sql = f"""
                SELECT 
                  c.location,
                  DATE_FORMAT(d.datatime, '%Y-%m') AS month,
                  COUNT(*) AS count
                FROM camera c
                JOIN data d ON c.camera_id = d.camera_id
                GROUP BY c.location, month
                ORDER BY c.location, month;
              """

      cur.execute(sql)

      columns = cur.description 
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in cur.fetchall()]
    return result

  @app.route("/api/time_three_graph", methods=['GET'])
  def time_three_graph():
    with lock:
      sql = f"""
                SELECT 
                  hour_group,
                  alarm_count
                FROM (
                  SELECT 
                    DATE_FORMAT(datatime, '%H') AS hour_group,
                    COUNT(*) AS alarm_count
                  FROM data
                  WHERE DATE(datatime) = CURDATE()
                  GROUP BY hour_group
                  ORDER BY alarm_count DESC
                  LIMIT 3
                ) AS top_hours;
              """

      cur.execute(sql)

      columns = cur.description 
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in cur.fetchall()]

    return result

  @app.route("/api/place_three_graph", methods=['GET'])
  def place_three_graph():
    with lock:

      sql = f"""
                SELECT
                  sub.location,
                  sub.location_count
                FROM (
                  SELECT
                    c.location,
                    COUNT(*) AS location_count
                  FROM
                    camera c
                  JOIN
                    data d ON c.camera_id = d.camera_id
                  WHERE
                    DATE(d.dataTime) = CURDATE() -- 오늘 날짜에 해당하는 데이터만 선택
                  GROUP BY
                    c.location
                  ORDER BY
                    location_count DESC -- 카운트 내림차순으로 정렬
                  LIMIT 3 -- 상위 3개만 선택
                ) AS sub;
              """

      cur.execute(sql)

      columns = cur.description 
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in cur.fetchall()]

    return result
  @app.route("/api/setting", methods=['GET'])
  @as_json
  def setting():
    with lock:
      sql = f"""
              SELECT 
                c.location,
                c.camera_id,
                c.vol_ment,
                c.nonvio_ment
              FROM 
                camera c
            """
      cur.execute(sql)
      columns = cur.description 
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in cur.fetchall()]
    return result 
  
  @app.route("/api/update_setting/<location>/<sound>/<repeat_number>/<repeat_cycle>/<start_time>/<end_time>/<vol_ment>/<nonvio_ment>", methods=['GET'])
  @as_json
  def update_setting(location, sound, repeat_number, repeat_cycle, start_time, end_time, vol_ment, nonvio_ment):
      with lock:
          sql = f"""
            UPDATE data
            SET sound = '{sound}',
            repeat_number = '{repeat_number}',
            repeat_cycle = '{repeat_cycle}',
            start_time = '{start_time}',
            end_time = '{end_time}',
            vol_ment = '{vol_ment}',
            nonvio_ment= '{nonvio_ment}'
            WHERE location = {location};
          """
          params = (sound, repeat_number, repeat_cycle ,start_time ,end_time ,vol_ment ,nonvio_ment ,location)
          cur.execute(sql,params)
          columns = cur.description 
          result =[ {columns[index][0]:column for index,column in enumerate(value)} for value in cur.fetchall()]
      return result
    
  if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True) 
    db.close()
    cur.close()
    
finally:
    db.close()
    cur.close()
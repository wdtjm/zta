import requests
from bs4 import BeautifulSoup
import urllib3
import rsa
import sys
import re
import json

urllib3.disable_warnings()


def rsa_encrypt(message, pub_key):
    key_length = rsa.common.byte_size(pub_key.n)
    payload = rsa.transform.bytes2int(message)
    cypher = rsa.core.encrypt_int(payload, pub_key.e, pub_key.n)
    return rsa.transform.int2bytes(cypher, key_length)


session = requests.session()
session.keep_alive = False
mode = sys.argv[1]
if(mode != "4"):
    zju_username = sys.argv[2]
    zju_password = sys.argv[3]
    user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58'

    PUB_KEY_URL = 'https://zjuam.zju.edu.cn/cas/v2/getPubKey'
    LOGIN_URL = 'https://zjuam.zju.edu.cn/cas/login'
    try:
        res = session.get(LOGIN_URL, verify=False).text
    except Exception as e:
        print({"status": "error", "message": "网络请求错误", "data": str(e)})
        sys.exit(1)
    soup = BeautifulSoup(res, 'lxml')
    execution = soup.findAll('input', attrs={'name': 'execution'})[0]['value']

    pub = session.get(PUB_KEY_URL,verify=False).json()
    n = int(pub['modulus'], base=16)
    e = int(pub['exponent'], base=16)

    pub_key = rsa.PublicKey(n, e)

    encrypted_pass = rsa_encrypt(zju_password.encode(), pub_key).hex()

    form = {
        'username': zju_username,
        'password': encrypted_pass,
        'authcode': '',
        'execution': execution,
        '_eventId': 'submit'
    }
    requests.packages.urllib3.disable_warnings()
    session.post(LOGIN_URL, data=form, verify=False)
    cookies = session.cookies
    # 把cookies转为json格式
    cookies_json = requests.utils.dict_from_cookiejar(cookies)
    


def get_course_table():
    response = requests.get(
        "https://zjuam.zju.edu.cn/cas/login?service=http%3A%2F%2Fzdbk.zju.edu.cn%2Fjwglxt%2Fxtgl%2Flogin_ssologin.html",
        cookies={'iPlanetDirectoryPro': Osscookie.value}, timeout=8, allow_redirects=False,verify=False)
    response1 = requests.get(response.headers['Location'], allow_redirects=False,verify=False)
    cookies = response1.cookies
    if any(cookie.name == 'JSESSIONID' for cookie in cookies):
        # 返回第一个名为 'JSESSIONID' 的 Cookie
        JSESSIONID = next(cookie for cookie in cookies if cookie.name == 'JSESSIONID')
    if any(cookie.name == 'route' for cookie in cookies):
        # 返回第一个名为 'route' 的 Cookie
        route = next(cookie for cookie in cookies if cookie.name == 'route')

    url = "http://zdbk.zju.edu.cn/jwglxt/kbcx/xskbcx_cxXsKb.html"
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    xq = ['1|秋', '1|冬', '2|春', '2|夏']
    data = {
        'xnm': str(int(sys.argv[4])) + "-" + str(int(sys.argv[4]) + 1),  # 学年
        'xqm': xq[int(sys.argv[5]) - 1],  # 学期
    }
    try:
        # 发送POST请求
        response = requests.post(url, headers=headers, data=data, timeout=8,
                                 cookies={JSESSIONID.name: JSESSIONID.value, route.name: route.value})
        response.raise_for_status()  # 检查请求是否成功
    except requests.exceptions.RequestException as e:
        print({"status": "error", "message": "网络请求错误", "data": str(e)})
        sys.exit(1)
    print({"status": "success", "message": "请求成功", "data": json.loads(response.text)})


def get_todo():
    todo_url = "https://courses.zju.edu.cn/api/todos?no-intercept=true"
    todo_resp = session.get(url=todo_url, cookies=cookies, verify=False)
    res = json.loads(todo_resp.text)['todo_list']
    print({"status": "success", "message": "请求成功", "data": res})

def get_yjs_token():
    response = requests.get(
        "https://zjuam.zju.edu.cn/cas/login?service=https%3A%2F%2Fyjsy.zju.edu.cn%2F",
        cookies={'iPlanetDirectoryPro': Osscookie.value}, timeout=8, allow_redirects=False,verify=False)
    ticket_loc = response.headers['Location'].find("ticket=")
    ticket = response.headers['Location'][ticket_loc + 7:]
    response1 = requests.get("https://yjsy.zju.edu.cn/dataapi/sys/cas/client/validateLogin?ticket="+ticket+"&service=https:%2F%2Fyjsy.zju.edu.cn%2F",verify=False)
    loginJson = json.loads(response1.text)
    token = loginJson['result']['token']
    return token

def get_yjs_table():
    xqs = ['','13','14','11','12'] #秋冬春夏
    xq = xqs[int(sys.argv[3])]
    xn = sys.argv[2]
    token = sys.argv[4]
    response = requests.get("https://yjsy.zju.edu.cn/dataapi/py/pyKcbj/queryXskbByLoginUser?xn="+xn+"&pkxq="+xq,headers={"X-Access-Token":token},verify=False)
    print(response.text)


if mode == "4" or any(cookie.name == 'iPlanetDirectoryPro' for cookie in cookies):
    # 返回第一个名为 'iPlanetDirectoryPro' 的 Cookie
    if mode != "4":
        Osscookie = next(cookie for cookie in cookies if cookie.name == 'iPlanetDirectoryPro')
    if mode == '0':
        print({"status": "success", "message": "登录成功", "data": ""})
    elif mode == '1':
        get_course_table()
    elif mode == '2':
        get_todo()
    elif mode == '3':
        token = get_yjs_token()
        if(token):
            print({"status":"success","message":"","data":token})
        else:
            print({"status": "error", "message": "error", "data": ""})
    elif mode == '4':
        get_yjs_table()

else:
    print({"status": "error", "message": "登录失败", "data": ""})
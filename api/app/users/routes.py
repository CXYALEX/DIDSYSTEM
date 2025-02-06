from flask import request
from flask_jwt_extended import create_access_token
from app import db
from app.users import users_bp
from app.users.models import User, Auth, Role, Menu
from app.users.schema import UserSchema, AuthSchema, RoleSchema, MenuSchema
from app.utils.responses import response_with
from app.utils import responses as resp
from flask_jwt_extended import jwt_required, get_jwt_identity

@users_bp.route('/register', methods=['POST'])
def create_user():
    """
    用户注册接口
    ---
    parameters:
        - in: body
          name: body
          schema:
            required:
                - username
                - password
                - role_id
            properties:
                username:
                    type: string
                    description: 用户名
                    default: ""
                password:
                    type: string
                    description: 用户密码
                    default: ""
                role_id:
                    type: string
                    description: 角色
                    default: ""
    responses:
        201:
            description: 注册成功
            schema:
                properties:
                    code:
                        type: string
        422:
            description: 注册失败
            schema:
                properties:
                    code:
                        type: string
                    message:
                        type: string
    """
    try:
        data = request.get_json()
        print(data)
        data['password'] = User.generate_hash(data['password'])
        user_schema = UserSchema()
        users = user_schema.load(data)
        result = user_schema.dump(users.create())
        
        return response_with(resp.SUCCESS_201, value={"user": result})
    except Exception as e:
        print(e)
        return response_with(resp.INVALID_INPUT_422)


@users_bp.route('/info', methods=['GET'])
def get_user_list():
    fetched = User.query.all()
    user_schema = UserSchema(many=True)
    users = user_schema.dump(fetched)
    return response_with(resp.SUCCESS_200, value={"users": users})


# @users_bp.route('/info/<int:id>', methods=['GET'])
# def get_user_info(id):
#     user_info = User.query.get_or_404(id)
#     user_schema = UserSchema()
#     user = user_schema.dump(user_info)
#     return response_with(resp.SUCCESS_200, value={"user": user, "menu": "[]"})


@users_bp.route('/login', methods=['POST'])
def authenticate_user():
    """
    用户登录接口
    ---
    parameters:
    - in: body
      name: body
      schema:
        required:
        - username
        - password
        properties:
          username:
            type: string
            description: 用户名
            default: ""
          password:
            type: string
            description: 用户密码
            default: ""
    responses:
      200:
        description: 登录成功
        schema:
          properties:
            message:
              type: string
              description: 登录成功信息
            token:
              type: string
              description: JWT 访问令牌
            name:
              type: string
              description: 用户名
            role_id:
              type: string
              description: 角色id
            avatar:
              type: string
              description: 用户头像 URL
      401:
        description: 未授权，用户名或密码错误
        schema:
          properties:
            code:
              type: string
            message:
              type: string
      404:
        description: 用户未找到
        schema:
          properties:
            code:
              type: string
            message:
              type: string
      422:
        description: 输入验证失败
        schema:
          properties:
            code:
              type: string
            message:
              type: string
    """
    try:
        data = request.get_json()
        current_user = User.find_by_username(data['username'])
        if not current_user:
            return response_with(resp.SERVER_ERROR_404)
        if User.verify_hash(data['password'], current_user.password):
            # 创建 JWT 访问令牌
            access_token = create_access_token(identity=data['username'])
            return response_with(resp.SUCCESS_201, value={'message': 'Logged in as {}'.format(current_user.username),
                                                          "token": access_token, "name": current_user.username,
                                                          "role_id": current_user.role_id,
                                                          "avatar": 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'})
        else:
            return response_with(resp.UNAUTHORIZED_401)
    except Exception as e:
        print(e)
        return response_with(resp.INVALID_INPUT_422)



@users_bp.route('/getInfo', methods=['GET'])
@jwt_required()
def get_user_info():
    """
    获取用户信息接口
    ---
    responses:
      200:
        description: 获取用户信息成功
        schema:
          properties:
            username:
              type: string
              description: 用户名
            role_id:
              type: string
              description: 角色 ID
      401:
        description: 未授权, JWT token 无效或缺失
        schema:
          properties:
            code:
              type: string
            message:
              type: string
    """
    try:
        # 获取当前用户的身份信息
        current_username = get_jwt_identity()
        
        # 查询用户信息
        current_user = User.find_by_username(current_username)
        if not current_user:
            return response_with(resp.SERVER_ERROR_404)

        # 返回用户信息
        return response_with(resp.SUCCESS_200, value={
            "name": current_user.username,
            "role_id": current_user.role_id,
            "avatar": 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        })
        
    except Exception as e:
        print(e)
        return response_with(resp.INVALID_INPUT_422)


@users_bp.route('/auth', methods=['POST'])
def create_auth():
    try:
        data = request.get_json()
        auth_schema = AuthSchema()
        auth = auth_schema.load(data)
        result = auth_schema.dump(auth.create())
        return response_with(resp.SUCCESS_200, value={"auth": result})
    except Exception as e:
        return response_with(resp.INVALID_INPUT_422, value={'msg': e})


@users_bp.route('/auth', methods=['GET'])
def get_auth_list():
    fetched = Auth.query.all()
    auth_schema = AuthSchema(many=True)
    auths = auth_schema.dump(fetched)
    return response_with(resp.SUCCESS_200, value={"auths": auths})


@users_bp.route('/auth/<int:id>', methods=['GET'])
def get_auth_info(id):
    auth_info = Auth.query.get_or_404(id)
    auth_schema = AuthSchema()
    auth = auth_schema.dump(auth_info)
    return response_with(resp.SUCCESS_200, value={"auth": auth})


@users_bp.route('/auth/<int:id>', methods=['PUT'])
def update_auth(id):
    pass


@users_bp.route('/auth/<int:id>', methods=['DELETE'])
def delete_auth(id):
    get_auth = Auth.query.get_or_404(id)
    db.session.delete(get_auth)
    db.session.commit()
    return response_with(resp.SUCCESS_204)


@users_bp.route('/role', methods=['POST'])
def create_role():
    try:
        data = request.get_json()
        role_schema = RoleSchema()
        role = role_schema.load(data)
        result = role_schema.dump(role.create())
        return response_with(resp.SUCCESS_200, value={"role": result})
    except Exception as e:
        return response_with(resp.INVALID_INPUT_422, value={'msg': e})


@users_bp.route('/role', methods=['GET'])
def get_role_list():
    fetched = Role.query.all()
    role_schema = RoleSchema(many=True)
    role = role_schema.dump(fetched)
    return response_with(resp.SUCCESS_200, value={'role': role})


@users_bp.route('/role/<int:id>', methods=['GET'])
def get_role_info(id):
    role_info = Role.query.get_or_404(id)
    role_schema = RoleSchema()
    role = role_schema.dump(role_info)
    return response_with(resp.SUCCESS_200, value={"role": role})


@users_bp.route('/role/<int:id>', methods=['PUT'])
def update_role(id):
    pass


@users_bp.route('/role/<int:id>', methods=['DELETE'])
def delete_role(id):
    get_role = Role.query.get_or_404(id)
    db.session.delete(get_role)
    db.session.commit()
    return response_with(resp.SUCCESS_204)


@users_bp.route('/menu', methods=['POST'])
def create_menu():
    try:
        data = request.get_json()
        menu_schema = MenuSchema()
        menu = menu_schema.load(data)
        result = menu_schema.dump(menu.create())
        return response_with(resp.SUCCESS_200, value={"menu": result})
    except Exception as e:
        return response_with(resp.INVALID_INPUT_422, value={'msg': e})


@users_bp.route('/menu', methods=['GET'])
def get_menu_list():
    fetched = Menu.query.all()
    menu_schema = MenuSchema(many=True)
    menu = menu_schema.dump(fetched)
    return response_with(resp.SUCCESS_200, value={'menu': menu})


@users_bp.route('/menu/<int:id>', methods=['DELETE'])
def delete_menu(id):
    get_menu = Menu.query.get_or_404(id)
    db.session.delete(get_menu)
    db.session.commit()
    return response_with(resp.SUCCESS_200)

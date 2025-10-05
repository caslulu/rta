from flask import Flask, request, make_response
from flask_cors import CORS
# from app.extensions import db, migrate  # Não necessário para RTA
from app.config import Config

# Importar routes da API
from app.routes.api_rta_routes import api_rta_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configurar CORS de forma simples e robusta
    CORS(app)

    # Handler adicional para garantir CORS
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    # Inicializar extensões - não necessárias para RTA
    # db.init_app(app)
    # migrate.init_app(app, db)

    # Registrar blueprints da API
    app.register_blueprint(api_rta_bp)

    # Criar tabelas do banco de dados - não necessário para RTA
    # with app.app_context():
    #     db.create_all()

    # Rota de health check
    @app.route('/api/health')
    def health_check():
        return {'status': 'ok', 'message': 'Backend API funcionando', 'version': '1.0.0'}

    # Rota de informações da API
    @app.route('/api/info')
    def api_info():
        return {
            'name': 'Auto RTA API',
            'version': '1.0.0',
            'endpoints': {
                'rta': '/api/rta',
                'health': '/api/health'
            }
        }

    return app
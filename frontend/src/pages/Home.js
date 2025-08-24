import React from "react";
import { Link } from "react-router-dom";
import { Play, Users, Award, Zap } from "lucide-react";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Дай себе шанс — загрузи видео, и тебя увидят
            </h1>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Scout.kz — это цифровая платформа для поиска молодых футбольных
              талантов в Казахстане. Покажи свои навыки и получи возможность
              быть замеченным профессиональными скаутами.
            </p>
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-primary-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-200"
              >
                Зарегистрироваться
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition duration-200"
              >
                Войти
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Как это работает
            </h2>
            <p className="text-lg text-gray-600">
              Простой путь к профессиональному футболу
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Регистрация</h3>
              <p className="text-gray-600">
                Создай аккаунт игрока и заполни свой профиль
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Загрузи видео</h3>
              <p className="text-gray-600">
                Покажи свои лучшие моменты в 1-2 минутном видео
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Получи оценку</h3>
              <p className="text-gray-600">
                Скауты и тренеры оценят твои навыки
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Будь замечен</h3>
              <p className="text-gray-600">
                Получи приглашения от клубов и тренеров
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Готов показать свой талант?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Присоединяйся к сообществу молодых футболистов Казахстана
          </p>
          <Link to="/register" className="btn-primary text-lg py-3 px-8">
            Начать сейчас
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

// < 모듈화 : 기본 >
/*
    * 모듈화 패턴 3 : 프로토타입 객체 할당 패턴
    
    * 테스트
        -> 그냥 실행
*/

var userModule = require("./ch07_test8_module_user");

var User_1 = new userModule("test01", "소녀시대");
User_1.printUser();

var User_2 = new userModule("test02", "친구");
User_2.printUser();
import Cat from '../../assets/animals/cat.png';
import Dog from '../../assets/animals/dog.png';
import Monkey from '../../assets/animals/monkey.png';
import Pig from '../../assets/animals/pig.png';
import Rabbit from '../../assets/animals/rabbit.png';

export const getPPByCategory = (category) => {
    switch(category) {
        case 'Cat':
            return Cat;
        case 'Dog':
            return Dog;
        case 'Monkey':
            return Monkey;
        case 'Guinea Pig':
            return Pig;
        case 'Rabbit':
            return Rabbit;
        default:
            return Dog;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DiceGame
 * @dev Контракт для генерации случайных чисел (бросков кубиков) в D&D игре
 * и сохранения истории бросков
 */
contract DiceGame is Ownable {
    // Структура для хранения информации о броске кубика
    struct Roll {
        address player;      // адрес игрока
        uint8 diceType;      // тип кубика (4, 6, 20)
        uint8 result;        // результат броска
        uint256 timestamp;   // временная метка
        string reason;       // причина броска (опционально)
    }
    
    // Счетчик всех бросков
    uint256 public rollsCount;
    
    // Маппинг для хранения всех бросков
    mapping(uint256 => Roll) public diceRolls;
    
    // Маппинг для хранения бросков каждого игрока
    mapping(address => uint256[]) public playerRolls;
    
    // События
    event DiceRolled(
        address indexed player,
        uint256 rollId,
        uint8 diceType,
        uint8 result,
        string reason
    );
    
    /**
     * @dev Конструктор устанавливает владельца контракта
     */
    constructor() Ownable(msg.sender) {
        rollsCount = 0;
    }
    
    /**
     * @dev Генерирует случайное число (бросок кубика)
     * @param diceType Тип кубика (4, 6, 20)
     * @param reason Причина броска кубика (опционально)
     * @return Результат броска
     */
    function rollDice(uint8 diceType, string memory reason) public returns (uint8) {
        // Проверяем, что тип кубика допустимый
        require(diceType == 4 || diceType == 6 || diceType == 20, "Invalid dice type");
        
        // Генерируем псевдослучайное число
        uint8 result = uint8(uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            rollsCount
        ))) % diceType) + 1;
        
        // Сохраняем результат броска
        uint256 rollId = rollsCount;
        diceRolls[rollId] = Roll({
            player: msg.sender,
            diceType: diceType,
            result: result,
            timestamp: block.timestamp,
            reason: reason
        });
        
        // Добавляем бросок в историю игрока
        playerRolls[msg.sender].push(rollId);
        
        // Увеличиваем счетчик бросков
        rollsCount++;
        
        // Вызываем событие
        emit DiceRolled(msg.sender, rollId, diceType, result, reason);
        
        return result;
    }
    
    /**
     * @dev Возвращает последние N бросков игрока
     * @param player Адрес игрока
     * @param count Количество бросков для возврата
     * @return Массив структур Roll с информацией о бросках
     */
    function getPlayerRolls(address player, uint256 count) public view returns (Roll[] memory) {
        uint256[] storage playerRollIds = playerRolls[player];
        uint256 totalRolls = playerRollIds.length;
        
        // Ограничиваем count количеством доступных бросков
        if (count > totalRolls) {
            count = totalRolls;
        }
        
        // Создаем массив для результатов
        Roll[] memory result = new Roll[](count);
        
        // Заполняем массив последними бросками (с конца)
        for (uint256 i = 0; i < count; i++) {
            uint256 index = totalRolls - i - 1;
            result[i] = diceRolls[playerRollIds[index]];
        }
        
        return result;
    }
}

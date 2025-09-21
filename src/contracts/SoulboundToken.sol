// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SoulboundToken
 * @dev Реализация стандарта ERC721 с невозможностью передачи токенов (Soulbound).
 * Токен хранит URI с метаданными персонажа D&D.
 */
contract SoulboundToken is ERC721, Ownable {
    using Strings for uint256;

    // Маппинг tokenId к tokenURI
    mapping(uint256 => string) private _tokenURIs;
    
    // Счетчик для генерации уникальных tokenId
    uint256 private _tokenIdCounter;
    
    // События
    event TokenURIUpdated(uint256 indexed tokenId, string tokenURI);

    /**
     * @dev Конструктор устанавливает имя и символ токена
     */
    constructor(string memory name_, string memory symbol_) 
        ERC721(name_, symbol_) 
        Ownable(msg.sender) 
    {}

    /**
     * @dev Создает новый токен и привязывает его к указанному адресу
     * @param to Адрес получателя токена
     * @param uri URI метаданных токена
     * @return Идентификатор созданного токена
     */
    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        return tokenId;
    }
    
    /**
     * @dev Обновляет URI метаданных токена
     * @param tokenId ID токена
     * @param uri Новый URI метаданных
     */
    function setTokenURI(uint256 tokenId, string memory uri) public {
        // Только владелец токена или контракта может обновить URI
        require(_isApprovedOrOwner(msg.sender, tokenId) || owner() == msg.sender, 
            "SBT: caller is not owner nor approved");
        
        _setTokenURI(tokenId, uri);
    }
    
    /**
     * @dev Внутренняя функция для установки URI токена
     * @param tokenId ID токена
     * @param uri Новый URI метаданных
     */
    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(_exists(tokenId), "SBT: URI set of nonexistent token");
        _tokenURIs[tokenId] = uri;
        
        emit TokenURIUpdated(tokenId, uri);
    }
    
    /**
     * @dev Возвращает URI метаданных для заданного токена
     * @param tokenId ID токена
     * @return URI метаданных токена
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "SBT: URI query for nonexistent token");
        
        string memory _tokenURI = _tokenURIs[tokenId];
        
        // Если URI не задан, возвращаем пустую строку
        if (bytes(_tokenURI).length == 0) {
            return "";
        }
        
        return _tokenURI;
    }
    
    /**
     * @dev Сжигает токен (может использовать только владелец токена)
     * @param tokenId ID токена для сжигания
     */
    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "SBT: caller is not owner nor approved");
        _burn(tokenId);
        
        // Очищаем URI при сжигании токена
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }
    
    /**
     * @dev Переопределяем функцию transferFrom для запрета передачи токенов
     * Токены Soulbound не могут быть переданы после минта
     */
    function transferFrom(address from, address to, uint256 tokenId) public override {
        require(false, "SBT: tokens are soulbound and cannot be transferred");
        super.transferFrom(from, to, tokenId);
    }
    
    /**
     * @dev Переопределяем функцию safeTransferFrom для запрета передачи токенов
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        require(false, "SBT: tokens are soulbound and cannot be transferred");
        super.safeTransferFrom(from, to, tokenId, data);
    }
}

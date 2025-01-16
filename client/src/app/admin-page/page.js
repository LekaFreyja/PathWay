"use client";

// client/src/app/admin-page/page.js
import React, { useState, useEffect, useRef } from 'react';
import AuthGuard from '../../components/AuthGuard';
import GameWindow from '../../components/GameWindow';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState("assets");
    const [message, setMessage] = useState("");
    const router = useRouter();
    const tabs = [
        { id: "assets", label: "Ассеты" },
        { id: "dialogues", label: "Реплики" },
        { id: "scenes", label: "Сцены" },
        { id: "choice", label: "Выборы" },
        { id: "editscene", label: "Редактор сцен" },
        { id: "branch", label: "Выборы" },
        { id: "editdialogue", label: "Редактор реплик" }
    ];
    const modalRef = useRef(null);
    const sceneModalRef = useRef(null);
    const dialogueModalRef = useRef(null);


    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            closeModal();
        }
        if (sceneModalRef.current && !sceneModalRef.current.contains(event.target)) {
            closeSceneModal();
        }
        if (dialogueModalRef.current && !dialogueModalRef.current.contains(event.target)) {
            closeDialogueModal();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        console.log('Closed')
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);


    const [assetName, setAssetName] = useState("");
    const [assetType, setAssetType] = useState("");
    const [assetPosition, setAssetPosition] = useState("");
    const [assetFile, setAssetFile] = useState(null);


    const [users, setUsers] = useState([]);

    // Form state for dialogues
    const [dialogueText, setDialogueText] = useState("");
    const [dialogueCharacter, setDialogueCharacter] = useState("");
    const [sceneId, setSceneId] = useState("");  // Состояние для сцены
    const [order, setOrder] = useState("");  // Состояние для порядка
    const [position, setPosition] = useState({ x: "", y: "" });  // Состояние для позиции
    // Form state for scenes

    const [sceneName, setSceneName] = useState("");
    const [sceneOrder, setSceneOrder] = useState("");
    const [sceneBranch, setSceneBranch] = useState("");
    const [sceneDescription, setSceneDescription] = useState("");  // Состояние для описания сцены
    const [backgroundAssets, setBackgroundAssets] = useState(''); // Идентификатор выбранного ассета
    const [backgroundAsset, setBackgroundAsset] = useState(''); // Идентификатор выбранного ассета
    const [assets, setAssets] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [lastDialogue, setLastDialogue] = useState([])
    const [scenes, setScenes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewSceneId, setPreviewSceneId] = useState('first');

    const [isSceneModalOpen, setIsSceneModalOpen] = useState(false);
    const [selectedScene, setSelectedScene] = useState(null);

    const handleSceneClick = async (sceneId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/scenes/${sceneId}`);
            const sceneData = response.data;
            setName(sceneData.name);
            setDescription(sceneData.description);
            setOrder(sceneData.order);
            setBranch(sceneData.branch);
            setAssetId(sceneData.assetId);
            setSelectedScene(sceneData);
            setIsSceneModalOpen(true);
            setSceneId(sceneData.id)
            console.log(sceneData.id)
        } catch (error) {
            setMessage('Error fetching scene data');
        }
    };

    const closeSceneModal = () => {
        setIsSceneModalOpen(false);
        setSelectedScene(null);
    };
    const handlePreview = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const fetchAssetsAndScenes = async () => {
        try {
            const [assetsResponse, scenesResponse] = await Promise.all([
                axios.get('http://localhost:3000/api/assets'),  // Получение всех персонажей
                axios.get('http://localhost:3000/api/scenes')   // Получение всех сцен
            ]);

            setBackgroundAssets(assetsResponse.data.filter(asset => asset.type === 'background')); // Обновляем персонажей
            setAssets(assetsResponse.data);
            setScenes(scenesResponse.data); // Обновляем сцены
            setCharacters(assetsResponse.data.filter(asset => asset.type === 'character'))
            setLastDialogue(scenesResponse.data[0].dialogueLines)
        } catch (error) {
            setMessage('Error fetching assets or scenes');
        }
    };
    useEffect(() => {
        fetchAssetsAndScenes();
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/users/users');
            setUsers(response.data);
        } catch (error) {
            setMessage('Error fetching users');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handleNavigation = (path) => {
        router.push(path);
    };
    const [isDialogueModalOpen, setIsDialogueModalOpen] = useState(false);
    const [selectedDialogue, setSelectedDialogue] = useState(null);
    const [editDialogueText, setEditDialogueText] = useState("");
    const [editDialogueCharacter, setEditDialogueCharacter] = useState("");
    const [editDialogueOrder, setEditDialogueOrder] = useState("");
    const [editDialoguePosition, setEditDialoguePosition] = useState({ x: "", y: "" });

    const handleDialogueClick = async (dialogueId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/dialogues/${dialogueId}`);
            const dialogueData = response.data;
            setEditDialogueText(dialogueData.text);
            setEditDialogueCharacter(dialogueData.characterId);
            setEditDialogueOrder(dialogueData.order);
            setEditDialoguePosition(dialogueData.position);
            setSelectedDialogue(dialogueData);
            setIsDialogueModalOpen(true);
        } catch (error) {
            setMessage('Error fetching dialogue data');
        }
    };

    const closeDialogueModal = () => {
        setIsDialogueModalOpen(false);
        setSelectedDialogue(null);
    };

    const handleSubmitEditDialogue = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/dialogues/${selectedDialogue.id}`, {
                text: editDialogueText,
                characterId: editDialogueCharacter,
                order: editDialogueOrder,
                position: editDialoguePosition,
            });
            alert('Dialogue updated successfully!');
            fetchAssetsAndScenes(); // Refresh the data
        } catch (error) {
            console.log(error);
            alert('Error updating dialogue.');
        }
    };
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [branch, setBranch] = useState('');
    const [assetId, setAssetId] = useState('');

    const handleSubmitEditScene = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/scenes/${sceneId}`, { name, description, order, branch, assetId });
            alert('Сцена успешно добавлена!');
        } catch (error) {
            console.log(error)
            alert('Ошибка при добавлении сцены.');
        }
    };
    // Form state for choices
    const [choiceText, setChoiceText] = useState("");
    const [nextSceneId, setNextSceneId] = useState("");

    const handleAddChoice = async (e) => {
        e.preventDefault();
        try {
            const response = axios.post('http://localhost:3000/api/choices', {
                sceneId,
                text: choiceText,
                nextSceneId,
            });
            setMessage('Выбор успешно добавлен');
            fetchAssetsAndScenes();
        } catch (error) {
            setMessage('Ошибка при добавлении выбора');
        }
    };

    const handleSubmitBranch = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/scenes/${sceneId}`, { branch });
            alert('Ветка успешно обновлена!');
        } catch (error) {
            alert('Ошибка при обновлении ветки.');
        }
    };

    const handleAddAsset = async (e) => {
        e.preventDefault();

        if (!assetFile) {
            setMessage("Пожалуйста, загрузите файл.");
            return;
        }

        const formData = new FormData();
        formData.append("name", assetName);
        formData.append("type", assetType);
        formData.append("position", assetPosition);
        formData.append("file", assetFile);

        try {
            const response = await axios.post("http://localhost:3000/api/assets/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage("Ассет успешно загружен!");
            fetchAssetsAndScenes()
        } catch (error) {
            setMessage("Ошибка при загрузке ассета.");
        }
    };
    const handleAddDialogue = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/dialogues', {
                text: dialogueText,
                characterId: dialogueCharacter,
                sceneId,
                order,
                position
            });
            setMessage('Реплика успешно добавлена');
            fetchAssetsAndScenes();
        } catch (error) {
            setMessage('Ошибка при добавлении реплики');
        }
    };

    const handleAddScene = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/api/scenes", {
                name: sceneName,
                order: sceneOrder,
                branch: sceneBranch,
                description: sceneDescription,  // Добавляем описание
                assetId: backgroundAsset
            });
            setMessage("Сцена успешно добавлена!");
            fetchAssetsAndScenes();
        } catch (error) {
            setMessage("Ошибка при добавлении сцены.");
        }
    };

    return (
        <AuthGuard requiredRole={'admin'}>
            <div className="flex h-full items-center justify-center min-h-screen bg-gray-900 p-4">
                <div className="flex w-full max-w-7xl">
                    <div className="flex-grow bg-gray-800 p-8 rounded-lg shadow-lg" style={{ width: "80%" }}>
                        <h2 className="text-3xl mb-6 text-center text-white">Admin Panel</h2>

                        {/* Tabs */}
                        <div className="flex justify-center space-x-4 mb-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`py-2 px-4 rounded-md text-lg ${activeTab === tab.id ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Displaying the form based on active tab */}
                        {activeTab === "assets" && (
                            <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                                <h3 className="text-3xl text-white mb-6 text-center">Ассеты</h3>
                                <form onSubmit={handleAddAsset} className="grid gap-6">
                                    {/* Asset Name */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Название ассета</label>
                                        <input
                                            type="text"
                                            value={assetName}
                                            onChange={(e) => setAssetName(e.target.value)}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            required
                                        />
                                    </div>
                                    {/* Asset Type */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Тип ассета</label>
                                        <select
                                            value={assetType}
                                            onChange={(e) => setAssetType(e.target.value)}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            required
                                        >
                                            <option value="">Выберите тип</option>
                                            <option value="background">Фон</option>
                                            <option value="character">Персонаж</option>
                                            <option value="item">Предмет</option>
                                            <option value="other">Другое</option>
                                        </select>
                                    </div>

                                    {/* Asset Position */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Позиция</label>
                                        <select
                                            value={assetPosition}
                                            onChange={(e) => setAssetPosition(e.target.value)}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            required
                                        >
                                            <option value="">Выберите позицию</option>
                                            <option value="left">Левый</option>
                                            <option value="left-center">Левый центр</option>
                                            <option value="center">Центр</option>
                                            <option value="right-center">Правый центр</option>
                                            <option value="right">Правый</option>
                                        </select>
                                    </div>

                                    {/* Asset File */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Файл ассета</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setAssetFile(e.target.files[0])}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Загрузить ассет
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === "dialogues" && (
                            <div className="mb-8">
                                <h3 className="text-xl text-white mb-4">Реплики</h3>
                                {characters.length === 0 || scenes.length === 0 ? (
                                    <p className="text-red-500 text-center">Please add some characters and scenes before adding dialogues.</p>
                                ) : (
                                    <form onSubmit={handleAddDialogue} className="grid gap-4">
                                        {/* Dialogue Text */}
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Текст</label>
                                            <textarea
                                                value={dialogueText}
                                                onChange={(e) => setDialogueText(e.target.value)}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                rows="4"
                                                required
                                            />
                                        </div>

                                        {/* Character */}
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Персонаж</label>
                                            <select
                                                value={dialogueCharacter}
                                                onChange={(e) => setDialogueCharacter(e.target.value)}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                required
                                            >
                                                <option value="">Select Character</option>
                                                {characters.map((character) => (
                                                    <option key={character.id} value={character.id}>
                                                        {character.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Scene */}
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Сцена</label>
                                            <select
                                                value={scenes.id}
                                                onChange={(e) => setSceneId(e.target.value)}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                required
                                            >
                                                <option value="">Select Scene</option>
                                                {scenes.map((scene) => (
                                                    <option key={scene.id} value={scene.id}>
                                                        {scene.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Order */}
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Порядок</label>
                                            <select
                                                value={scenes.order}
                                                onChange={(e) => setOrder(Number(e.target.value))}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            >
                                                <option value="">Порядок</option>
                                                {lastDialogue.map((dialogue) => (
                                                    <option key={dialogue.order} value={dialogue.order}>
                                                        {dialogue.text}
                                                    </option>
                                                ))}
                                                {/* Новый элемент с порядком на 1 выше последнего */}
                                                <option
                                                    value={lastDialogue.length > 0 ? Math.max(...lastDialogue.map(d => d.order)) + 1 : 1}
                                                >
                                                    Новый диалог (Порядок {lastDialogue.length > 0 ? Math.max(...lastDialogue.map(d => d.order)) + 1 : 1})
                                                </option>
                                            </select>
                                        </div>

                                        {/* Position */}
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Позиция (x, y)</label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="number"
                                                    value={scenes.position}
                                                    onChange={(e) => setPosition({ ...position, x: Number(e.target.value) })}
                                                    className="w-1/2 p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                    placeholder="x"
                                                    required
                                                />
                                                <input
                                                    type="number"
                                                    value={scenes.position}
                                                    onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })}
                                                    className="w-1/2 p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                    placeholder="y"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
                                            Добавить реплику
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {activeTab === "scenes" && (
                            <div className="mb-8">
                                <h3 className="text-xl text-white mb-4">Сцены</h3>
                                <form onSubmit={handleAddScene} className="grid gap-4">
                                    {/* Scene Name */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Название сцены</label>
                                        <input
                                            type="text"
                                            value={sceneName}
                                            onChange={(e) => setSceneName(e.target.value)}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            required
                                        />
                                    </div>

                                    {/* Scene Order */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Порядок</label>
                                        <input
                                            type="number"
                                            value={sceneOrder}
                                            onChange={(e) => setSceneOrder(Number(e.target.value))}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            required
                                        />
                                    </div>
                                    {/* Scene Branch */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Ветка</label>
                                        <input
                                            type="number"
                                            value={sceneBranch}
                                            onChange={(e) => setSceneBranch(Number(e.target.value))}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            required
                                        />
                                    </div>
                                    {/* Description */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Описание</label>
                                        <textarea
                                            value={sceneDescription}
                                            onChange={(e) => setSceneDescription(e.target.value)}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            rows="4"
                                        />
                                    </div>

                                    {/* Background Selection */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Выбери фон</label>
                                        <select
                                            value={backgroundAsset}
                                            onChange={(e) => setBackgroundAsset(e.target.value)}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            required
                                        >
                                            <option value="">Select Background</option>
                                            {backgroundAssets.map((asset) => (
                                                <option key={asset.id} value={asset.id}>
                                                    {asset.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
                                        Добавить сцену
                                    </button>
                                </form>
                            </div>
                        )}
                        {activeTab === "choice" && (
                            <div className="mb-8">
                                <h3 className="text-xl text-white mb-4">Выборы</h3>
                                <form onSubmit={handleAddChoice} className="grid gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Текст выбора</label>
                                        <textarea
                                            value={choiceText}
                                            onChange={(e) => setChoiceText(e.target.value)}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            rows="4"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Сцена</label>
                                        <select
                                            value={sceneId}
                                            onChange={(e) => setSceneId(e.target.value)}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            required
                                        >
                                            <option value="">Выберите сцену</option>
                                            {scenes.map((scene) => (
                                                <option key={scene.id} value={scene.id}>
                                                    {scene.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-gray-400">Ветка после выбора</label>
                                        <select
                                            value={nextSceneId}
                                            onChange={(e) => setNextSceneId(e.target.value)}
                                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                            required
                                        >
                                            <option value="">Выберите сцену</option>
                                            {scenes.map((scene) => (
                                                <option key={scene.id} value={scene.id}>
                                                    {scene.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
                                        Добавить выбор
                                    </button>
                                </form>
                            </div>
                        )}
                        {activeTab === "editscene" && (
                            <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                                <h2 className="text-3xl text-white mb-6 text-center">Редактор сцен</h2>
                                <div className="grid gap-6">
                                    {scenes.map((scene) => (
                                        <div
                                            key={scene.id}
                                            className="p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                                            onClick={() => handleSceneClick(scene.id)}
                                        >
                                            {scene.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isSceneModalOpen && selectedScene && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                                <div className="bg-gray-800 text-white rounded-lg w-full max-w-3xl p-6 shadow-lg" ref={sceneModalRef}>
                                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={closeSceneModal}>
                                        &times;
                                    </button>
                                    <h3 className="text-2xl mb-4">Редактировать сцену: {selectedScene.name}</h3>
                                    <form onSubmit={handleSubmitEditScene} className="grid gap-6">
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Название сцены</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Описание</label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                rows="4"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Порядок</label>
                                            <input
                                                type="number"
                                                value={order}
                                                onChange={(e) => setOrder(Number(e.target.value))}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Ветка</label>
                                            <input
                                                type="text"
                                                value={branch}
                                                onChange={(e) => setBranch(e.target.value)}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Ассет</label>
                                            <select
                                                value={assetId}
                                                onChange={(e) => setAssetId(e.target.value)}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                required
                                            >
                                                <option value="">Select Asset</option>
                                                {backgroundAssets.map((asset) => (
                                                    <option key={asset.id} value={asset.id}>
                                                        {asset.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Обновить сцену
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                        {activeTab === "editdialogue" && (
                            <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                                <h2 className="text-3xl text-white mb-6 text-center">Редактор реплик</h2>
                                <div className="grid gap-6">
                                    {scenes.map((scene) => (
                                        scene.dialogueLines.map((dialogue) => (
                                            <div
                                                key={dialogue.id}
                                                className="p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                                                onClick={() => handleDialogueClick(dialogue.id)}
                                            >
                                                {dialogue.text}
                                            </div>
                                        ))
                                    ))}
                                </div>
                            </div>
                        )}

                        {isDialogueModalOpen && selectedDialogue && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                                <div className="bg-gray-800 text-white rounded-lg w-full max-w-3xl p-6 shadow-lg" ref={dialogueModalRef}>
                                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={closeDialogueModal}>
                                        &times;
                                    </button>
                                    <h3 className="text-2xl mb-4">Редактировать реплику</h3>
                                    <form onSubmit={handleSubmitEditDialogue} className="grid gap-6">
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Текст</label>
                                            <textarea
                                                value={editDialogueText}
                                                onChange={(e) => setEditDialogueText(e.target.value)}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                rows="4"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Персонаж</label>
                                            <select
                                                value={editDialogueCharacter}
                                                onChange={(e) => setEditDialogueCharacter(e.target.value)}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                required
                                            >
                                                <option value="">Select Character</option>
                                                {characters.map((character) => (
                                                    <option key={character.id} value={character.id}>
                                                        {character.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Порядок</label>
                                            <input
                                                type="number"
                                                value={editDialogueOrder}
                                                onChange={(e) => setEditDialogueOrder(Number(e.target.value))}
                                                className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-gray-400">Позиция (x, y)</label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="number"
                                                    value={editDialoguePosition.x}
                                                    onChange={(e) => setEditDialoguePosition({ ...editDialoguePosition, x: Number(e.target.value) })}
                                                    className="w-1/2 p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                    placeholder="x"
                                                    required
                                                />
                                                <input
                                                    type="number"
                                                    value={editDialoguePosition.y}
                                                    onChange={(e) => setEditDialoguePosition({ ...editDialoguePosition, y: Number(e.target.value) })}
                                                    className="w-1/2 p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                                    placeholder="y"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Обновить реплику
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                        {activeTab === "branch" && (
                            <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                                <h2>Edit Branch</h2>
                                <form onSubmit={handleSubmitBranch}>
                                    <input
                                        type="text"
                                        placeholder="Scene ID"
                                        value={sceneId}
                                        onChange={(e) => setSceneId(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Branch"
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        required
                                    />
                                    <button type="submit">Update Branch</button>
                                </form>
                            </div>
                        )}
                        {/* Message */}
                        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
                        {/* Logout and Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => { handleLogout() }}
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
                            >
                                Выйти
                            </button>
                            <button
                                onClick={() => handleNavigation('/menu')}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                            >
                                Вернуться в меню
                            </button>

                        </div>
                        <div className='flex justify-center'>
                            {/* Preview Button */}
                            <button
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={handlePreview}
                            >
                                Предпросмотр сцены
                            </button>
                            {/* Modal */}
                            {isModalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="relative bg-white rounded-lg w-1/2 h-1/2 p-4" ref={modalRef}>
                                        <div className="w-full h-full overflow-hidden">
                                            <GameWindow initialSceneId={previewSceneId} flagPreview={true} className="w-full h-full"/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                    <div className="w-2/5 p-4 rounded-lg shadow-md ml-4" style={{ minHeight: "100vh", backgroundColor: "#2a2a2a" }}>
                        <h3 className="text-xl text-white mb-2 text-center">Пользователи</h3>
                        <div className="overflow-auto"> {/* Обертка для адаптивности таблицы */}
                            <table className="w-full text-left bg-gray-700 text-white rounded-lg">
                                <thead>
                                    <tr>
                                        <th className="text-sm py-2 px-2">Username</th>
                                        <th className="text-sm py-2 px-4">Email</th>
                                        <th className="text-sm py-2 px-4">Role</th>
                                        <th className="text-sm py-2 px-4">Verified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.email}>
                                            <td className="text-sm py-2 px-2 border-t border-gray-600">{user.username}</td>
                                            <td className="text-sm py-2 px-2 border-t border-gray-600">{user.email}</td>
                                            <td className="text-sm py-2 px-2 border-t border-gray-600">{user.role}</td>
                                            <td className="text-sm py-2 px-2 border-t border-gray-600">{user.verified ? 'Yes' : 'No'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>

        </AuthGuard>

    );
}

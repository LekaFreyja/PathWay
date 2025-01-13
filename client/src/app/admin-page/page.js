"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import axios from "axios";
import AuthGuard from '../../components/AuthGuard';

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
    ];

    const [assetName, setAssetName] = useState("");
    const [assetType, setAssetType] = useState("");
    const [assetPosition, setAssetPosition] = useState("");
    const [assetFile, setAssetFile] = useState(null);




    // Form state for dialogues
    const [dialogueText, setDialogueText] = useState("");
    const [dialogueCharacter, setDialogueCharacter] = useState("");
    const [sceneId, setSceneId] = useState("");  // Состояние для сцены
    const [order, setOrder] = useState("");  // Состояние для порядка
    const [position, setPosition] = useState({ x: "", y: "" });  // Состояние для позиции
    // Form state for scenes

    const [sceneName, setSceneName] = useState("");
    const [sceneOrder, setSceneOrder] = useState("");
    const [sceneDescription, setSceneDescription] = useState("");  // Состояние для описания сцены
    const [backgroundAssets, setBackgroundAssets] = useState(''); // Идентификатор выбранного ассета
    const [backgroundAsset, setBackgroundAsset] = useState(''); // Идентификатор выбранного ассета
    const [characters, setCharacters] = useState([]);
    const [lastDialogue, setLastDialogue] = useState([])
    const [scenes, setScenes] = useState([]);
    const fetchAssetsAndScenes = async () => {
        try {
            const [assetsResponse, scenesResponse] = await Promise.all([
                axios.get('http://localhost:3000/api/assets'),  // Получение всех персонажей
                axios.get('http://localhost:3000/api/scenes')   // Получение всех сцен
            ]);

            setBackgroundAssets(assetsResponse.data.filter(asset => asset.type === 'background')); // Обновляем персонажей
            setScenes(scenesResponse.data); // Обновляем сцены
            setCharacters(assetsResponse.data.filter(asset => asset.type === 'character'))
            setLastDialogue(scenesResponse.data[0].dialogueLines)
        } catch (error) {
            setMessage('Error fetching assets or scenes');
        }
    };
    useEffect(() => {
        fetchAssetsAndScenes();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handleNavigation = (path) => {
        router.push(path);
    };

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [branch, setBranch] = useState('');
    const [assetId, setAssetId] = useState('');

    const handleSubmitEditScene = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/scenes/${sceneId}`, { name, description, order, branch, assetId });
            alert('Scene updated successfully!');
        } catch (error) {
            alert('Error updating scene.');
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
            setMessage(response.data);
            fetchAssetsAndScenes();
        } catch (error) {
            setMessage(response.data.error);
        }
    };

    const handleSubmitBranch = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/scenes/${sceneId}`, { branch });
            alert('Branch updated successfully!');
        } catch (error) {
            alert('Error updating branch.');
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
            setMessage('Dialogue added successfully');
            fetchAssetsAndScenes();
        } catch (error) {
            setMessage('Error adding dialogue');
        }
    };

    const handleAddScene = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/api/scenes", {
                name: sceneName,
                order: sceneOrder,
                description: sceneDescription,  // Добавляем описание
                assetId: backgroundAsset
            });
            setMessage("Scene added successfully!");
            fetchAssetsAndScenes();
        } catch (error) {
            setMessage("Error adding scene.");
        }
    };

    return (
        <AuthGuard requiredRole={'admin'}>
            <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl w-full">
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
                </div>
            </div>


        </AuthGuard>

    );
}

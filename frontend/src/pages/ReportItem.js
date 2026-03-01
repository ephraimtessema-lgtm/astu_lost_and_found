<<<<<<< HEAD

=======
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Package } from 'lucide-react';
import { toast } from 'react-toastify';

const ReportItem = () => {
    const [formData, setFormData] = useState({
        type: 'Lost',
        category: '',
        itemName: '',
        description: '',
        location: '',
<<<<<<< HEAD
        contactEmail: localStorage.getItem('email') || '' ,
=======
        contactEmail: localStorage.getItem('email') || '',
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
        contactNumber: '',
        telegramUsername: ''
    });

    const [itemImage, setItemImage] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [cameraStream, setCameraStream] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setItemImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
<<<<<<< HEAD

        // Get user from localStorage (backend requires reportedBy.userId)
        const userString = localStorage.getItem('user');
        if (!userString) {
            toast.error("You must be logged in to report an item.");
            return;
        }
        let user;
        try {
            user = JSON.parse(userString);
        } catch (parseErr) {
            console.error("Error parsing user from localStorage", parseErr);
            toast.error("Invalid session. Please log in again.");
            localStorage.removeItem('user');
            return;
        }
        if (!user || !user.userId) {
            toast.error("Invalid session. Please log in again.");
            return;
        }

=======
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
        try {
            const data = new FormData();
            data.append('type', formData.type);
            data.append('category', formData.category);
            data.append('itemName', formData.itemName);
            data.append('description', formData.description);
            data.append('location', formData.location);
            data.append('contactEmail', formData.contactEmail);
            data.append('contactNumber', formData.contactNumber);
            if (formData.telegramUsername) {
                data.append('telegramUsername', formData.telegramUsername);
            }

<<<<<<< HEAD
            // Backend requires reportedBy with username and userId
            data.append('reportedBy', JSON.stringify({
                username: user.username,
                userId: user.userId
            }));

=======
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
            if (itemImage) {
                data.append('itemImage', itemImage);
            }

            await axios.post('http://localhost:5000/api/items', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success("Item reported successfully!");
            window.location.href = '/home';
        } catch (err) {
            console.error(err);
<<<<<<< HEAD
            const message = err.response?.data?.message || err.response?.data?.error || "Error submitting report.";
            toast.error(message);
        }
    };


const openCamera = async () => {
=======
            toast.error("Error submitting report.");
        }
    };

    const openCamera = async () => {
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setCameraError('Camera not supported in this browser. Please use Upload an image.');
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setCameraStream(stream);
            setShowCamera(true);
            setCameraError('');
        } catch (err) {
            console.error('Error accessing camera:', err);
            setCameraError('Unable to access camera. Please check permissions or use Upload an image.');
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
        }
        setCameraStream(null);
        setShowCamera(false);
    };

    const captureFromCamera = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
                setItemImage(file);
                stopCamera();
            },
            'image/jpeg',
            0.9
        );
    };

    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [cameraStream]);

    const inputStyle = { width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #ddd', fontsize: '16px' };

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: '#003366', textAlign: 'center' }}><Package size={24} /> Report Item</h2>
                <form className="report-form" onSubmit={handleSubmit}>
                    <select
                        style={inputStyle}
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="Lost">I Lost Something</option>
                        <option value="Found">I Found Something</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Item Name (e.g. iPhone 13)"
                        required
                        style={inputStyle}
                        onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Category (e.g. Electronics, Keys)"
                        required
                        style={inputStyle}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />

                    <textarea
                        placeholder="Description (Color, marks, etc.)"
                        required
                        style={{ ...inputStyle, height: '100px' }}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

<<<<<<< HEAD

<input
=======
                    <input
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
                        type="text"
                        placeholder="Location (e.g. Library, Block 41)"
                        required
                        style={inputStyle}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />

                    <input
                        type="tel"
                        placeholder="Contact Phone (optional)"
                        style={inputStyle}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Telegram username (optional)"
                        style={inputStyle}
                        onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                    />

                    <div className="form-group">
                        <label style={{ color: '#003366', fontWeight: 700 }}>Item Image (optional)</label>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            <button
                                type="button"
                                style={{
                                    flex: '1 1 140px',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #003366',
                                    background: '#003366',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                                onClick={openCamera}
                            >
                                Take a picture
                            </button>
                            <button
                                type="button"
                                style={{
                                    flex: '1 1 160px',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #003366',
                                    background: 'white',
                                    color: '#003366',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                                onClick={() => document.getElementById('uploadImage')?.click()}
                            >
                                Upload an image
                            </button>
                        </div>

<<<<<<< HEAD

{/* Hidden input for standard upload */}
=======
                        {/* Hidden input for standard upload */}
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
                        <input
                            id="uploadImage"
                            className="hidden-file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {showCamera && (
                            <div style={{ marginTop: '10px' }}>
                                <video
                                    ref={videoRef}
                                    style={{
                                        width: '100%',
                                        borderRadius: '8px',
                                        backgroundColor: '#000'
                                    }}
                                    autoPlay
                                    playsInline
                                    muted
                                />
                                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                    <button
                                        type="button"
                                        style={{
                                            flex: '1 1 140px',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: '#28a745',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                        onClick={captureFromCamera}
                                    >
                                        Capture
                                    </button>
                                    <button
                                        type="button"
                                        style={{
                                            flex: '1 1 120px',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #ccc',
                                            background: 'white',
                                            color: '#333',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                        onClick={stopCamera}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                            </div>
                        )}
                        {cameraError && (
                            <small style={{ display: 'block', marginTop: '5px', color: 'red' }}>
                                {cameraError}
                            </small>
                        )}
                        {itemImage && (
                            <small style={{ display: 'block', marginTop: '5px', color: '#555' }}>
                                Selected: {itemImage.name}
                            </small>
                        )}
                    </div>

<<<<<<< HEAD

<button
=======
                    <button
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#003366',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Submit Report
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportItem;

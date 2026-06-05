import { useState } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { updateUser } from "@/reducer/authSlice";
import { pixelsAPI } from "@/api/allAPIs";

interface Props {
  imageFile: File | null;
  onClose: () => void;
  onSuccess: (newLogoUrl: string) => void;
}

export const ImageCropModel: React.FC<Props> = ({ imageFile, onClose, onSuccess }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  // Create a local object URL for the image
  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : "";

  const handleCropComplete = async () => {
    if (!imageFile) return;
    
    // Read file as base64 for upload
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const response = await pixelsAPI.updateLogo({
          email: user?.email,
          logo: base64String
        });
        if (response && response.status === 1) {
          dispatch(updateUser({ logo: base64String }));
          onSuccess(base64String);
          toast.success("Profile picture updated!");
          onClose();
        } else {
          toast.error(response?.info || "Failed to update logo");
        }
      } catch (error: any) {
        toast.error(error.message || "An error occurred while uploading");
      }
    };
    reader.readAsDataURL(imageFile);
  };

  if (!imageFile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Crop Profile Picture</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="relative h-64 bg-gray-900">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
          />
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-semibold mb-2 block">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg flex items-center gap-2"
            >
              <Check size={16} /> Save Picture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
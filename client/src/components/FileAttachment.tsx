import React, { useState, useRef, useEffect } from 'react';
import { Upload, File, Image, FileText, X, AlertCircle, Eye, ExternalLink } from 'lucide-react';
import type { IAttachment } from '../types/index';

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface ExistingAttachment {
  id: string;
  filename: string;
  url: string;
  type: string;
  size?: number;
}

interface FileAttachmentProps {
  files: AttachedFile[];
  onFilesChange: (files: AttachedFile[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  acceptedTypes?: string[];
  existingAttachments?: IAttachment[]; // For editing mode
  onRemoveExistingAttachment?: (attachmentId: string) => void; // Callback to remove existing attachment
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizePerFile = 10, // 10MB default
  acceptedTypes = ['image/*', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  existingAttachments = [],
  onRemoveExistingAttachment
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<AttachedFile | ExistingAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingAttachmentsList, setExistingAttachmentsList] = useState<ExistingAttachment[]>([]);

  // Process existing attachments when they change
  useEffect(() => {
    const processedAttachments: ExistingAttachment[] = existingAttachments.map((attachment, index) => ({
      id: `existing-${index}`,
      filename: attachment.filename,
      url: attachment.url,
      type: getFileTypeFromUrl(attachment.url),
      size: undefined // We don't have size info for existing attachments
    }));
    setExistingAttachmentsList(processedAttachments);
  }, [existingAttachments]);

  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'image/*';
      case 'pdf':
        return 'application/pdf';
      case 'doc':
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return 'application/octet-stream';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="file-icon file-type-image" />;
    } else if (type === 'application/pdf') {
      return <FileText className="file-icon file-type-pdf" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <FileText className="file-icon file-type-doc" />;
    }
    return <File className="file-icon" />;
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `File type ${file.type} is not supported. Please upload images, PDFs, or Word documents.`;
    }

    // Check file size
    const maxSizeBytes = maxSizePerFile * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizePerFile}MB.`;
    }

    return null;
  };

  const handleFiles = (newFiles: FileList | File[]) => {
    setError('');
    const fileArray = Array.from(newFiles);
    const validFiles: AttachedFile[] = [];
    const errors: string[] = [];

    // Check if adding these files would exceed the limit (including existing attachments)
    const totalCurrentFiles = files.length + existingAttachmentsList.length;
    if (totalCurrentFiles + fileArray.length > maxFiles) {
      setError(`You can only attach up to ${maxFiles} files. Currently have ${totalCurrentFiles} files.`);
      return;
    }

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        // Check for duplicate files
        const isDuplicate = files.some(existingFile => 
          existingFile.name === file.name && existingFile.size === file.size
        );
        
        if (!isDuplicate) {
          validFiles.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: file.size,
            type: file.type
          });
        } else {
          errors.push(`${file.name}: File already attached`);
        }
      }
    });

    if (errors.length > 0) {
      setError(errors.join('; '));
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter(file => file.id !== fileId));
    setError('');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const isImageFile = (file: AttachedFile | ExistingAttachment): boolean => {
    return file.type.startsWith('image/');
  };

  const openImagePreview = (file: AttachedFile | ExistingAttachment) => {
    if (isImageFile(file)) {
      setPreviewImage(file);
    }
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const removeExistingAttachment = (attachmentId: string) => {
    if (onRemoveExistingAttachment) {
      onRemoveExistingAttachment(attachmentId);
    }
  };

  const openAttachmentInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const renderFileItem = (file: AttachedFile) => {
    const isImage = isImageFile(file);
    
    return (
      <div key={file.id} className="file-item">
        <div className={isImage ? "file-item-info-with-image" : "file-item-info"}>
          {isImage ? (
            <img
              src={URL.createObjectURL(file.file)}
              alt={file.name}
              className="file-item-image"
              onClick={() => openImagePreview(file)}
              title="Click to preview"
            />
          ) : (
            getFileIcon(file.type)
          )}
          <div className={isImage ? "file-details-with-image" : "file-details"}>
            <div className="file-name">{file.name}</div>
            <div className="file-size">{formatFileSize(file.size)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isImage && (
            <button
              type="button"
              onClick={() => openImagePreview(file)}
              className="file-remove"
              title="Preview image"
              style={{ color: '#2563eb' }}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => removeFile(file.id)}
            className="file-remove"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderExistingAttachment = (attachment: ExistingAttachment) => {
    const isImage = isImageFile(attachment);
    
    return (
      <div key={attachment.id} className="file-item existing-attachment">
        <div className={isImage ? "file-item-info-with-image" : "file-item-info"}>
          {isImage ? (
            <img
              src={attachment.url}
              alt={attachment.filename}
              className="file-item-image"
              onClick={() => openImagePreview(attachment)}
              title="Click to preview"
            />
          ) : (
            getFileIcon(attachment.type)
          )}
          <div className={isImage ? "file-details-with-image" : "file-details"}>
            <div className="file-name">{attachment.filename}</div>
            <div className="file-size">{attachment.size ? formatFileSize(attachment.size) : 'Existing file'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isImage && (
            <button
              type="button"
              onClick={() => openImagePreview(attachment)}
              className="file-remove"
              title="Preview image"
              style={{ color: '#2563eb' }}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => openAttachmentInNewTab(attachment.url)}
            className="file-remove"
            title="Open in new tab"
            style={{ color: '#059669' }}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => removeExistingAttachment(attachment.id)}
            className="file-remove"
            title="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="file-attachment-container">
      <label className="file-attachment-label">
        Attach Files (Max {maxFiles} files, {maxSizePerFile}MB each)
      </label>
      
      <div
        className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <div className="file-drop-zone-content">
          <Upload className="file-drop-zone-icon" />
          <div>
            <div className="file-drop-zone-text">
              {dragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </div>
            <div className="file-drop-zone-subtext">
              Images, PDFs, Word documents (Max {maxSizePerFile}MB each)
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="file-input"
      />

      {(files.length > 0 || existingAttachmentsList.length > 0) && (
        <div className="file-list">
          {/* Render existing attachments first */}
          {existingAttachmentsList.map((attachment) => renderExistingAttachment(attachment))}
          {/* Then render new files */}
          {files.map((file) => renderFileItem(file))}
        </div>
      )}

      {previewImage && (
        <div className="image-preview-modal" onClick={closeImagePreview}>
          <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="image-preview-header">
              <div className="image-preview-title">Image Preview</div>
              <button
                type="button"
                onClick={closeImagePreview}
                className="image-preview-close"
                title="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="image-preview-body">
              <img
                src={'file' in previewImage ? URL.createObjectURL(previewImage.file) : previewImage.url}
                alt={'file' in previewImage ? previewImage.name : previewImage.filename}
                className="image-preview-img"
              />
              <div className="image-preview-info">
                <div className="image-preview-filename">
                  {'file' in previewImage ? previewImage.name : previewImage.filename}
                </div>
                <div className="image-preview-size">
                  {'file' in previewImage ? formatFileSize(previewImage.size) : 'Existing file'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(files.length + existingAttachmentsList.length) >= maxFiles - 1 && (files.length + existingAttachmentsList.length) < maxFiles && (
        <div className="file-limit-warning">
          <AlertCircle className="w-4 h-4 inline mr-2" />
          You can attach {maxFiles - (files.length + existingAttachmentsList.length)} more file{maxFiles - (files.length + existingAttachmentsList.length) === 1 ? '' : 's'}.
        </div>
      )}

      {error && (
        <div className="file-error">
          <AlertCircle className="w-4 h-4 inline mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileAttachment;
import React from 'react';
import { fabric } from 'fabric';
interface SizeProps {
    getActiveObject?: () => fabric.Object;
    isWorkSpace?: boolean;
    showRation?: boolean;
}
declare const Size: React.FC<SizeProps>;
export default Size;

if(!Array.prototype.includes) {
    Array.prototype.includes = function(val){
        for(var i=0;i<this.length;i++){
            if(this[i]==val)
                return true
        }
        return false
    }
}
